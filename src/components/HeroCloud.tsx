import { Cloud, Clouds } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { random } from 'maath'
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { MeshLambertMaterial, type Group, type PointLight } from 'three'
import { ringPosition } from '../animations/cloudOrbit'
import { createPuffs, pusherRadiusToClear, stepPuffs, type Puff as PuffBody } from '../animations/cloudPhysics'
import { useInView } from '../animations/useInView'
import styles from './HeroCloud.module.css'

/** Shared with the Hero: GSAP animates `progress` from 0 (whole) to 1 (broken). */
export type CloudBreak = { progress: number }

/** Self-hosted smoke sprite (drei's default lives on an external CDN). */
const TEXTURE = `${import.meta.env.BASE_URL}textures/cloud.png`

/** World width the cloud is designed for; narrower screens scale it down. */
const DESIGN_WIDTH = 12

/** Puffs going round the ring (animations/cloudOrbit.ts) over the name. */
const PUFF_COUNT = 8

/**
 * Depth of each puff: front and back alternate around the ring. drei sorts
 * the see-through sprites by distance every frame; neighbours at the same
 * depth keep swapping order as they pass, which reads as flicker.
 */
const depthOf = (index: number) => (index % 2 ? -0.8 : 0.8)

/** Sprites in a puff's base and in its top (see Puff). */
const BASE_SPRITES = 14
const TOP_SPRITES = 8

/** How fast (rad/s) each puff spins on itself; half spin the other way. */
const SPIN = 0.25

/** How far a puff's smoke reaches from its centre (sprite size + layer offset).
 *  Bigger than its collider: the smoke is wider than the physics body. */
const PUFF_EXTENT = 5

/** Closing speed above which a crash sets off lightning. */
const FLASH_IMPACT = 1.5
const FLASH_INTENSITY = 30
/** How far from a puff's centre a flash can strike. */
const FLASH_SPREAD = 0.4
/** How much each flash is pulled from its puff towards the middle of the cloud
 *  (0 = on the puff, 1 = dead centre), so edge puffs glow from inside too. */
const FLASH_INWARD = 0.3
/** Depth of the flash relative to its puff: at its centre, so the sprites in
 *  front of the light stay unlit and veil the glow, which reads as coming
 *  from inside. Further in front it lights the cloud from outside. */
const FLASH_DEPTH = 0
/** How far the flash reaches. Together with a gentle falloff (decay 1) it
 *  avoids a white hot spot on the sprites closest to the light. */
const FLASH_REACH = 6

type CloudColors = {
  light: string
  base: string
  shadow: string
  flashes: readonly [string, string]
}

function readColors(): CloudColors {
  const style = getComputedStyle(document.documentElement)
  const read = (name: string) => style.getPropertyValue(name).trim()
  return {
    light: read('--color-cloud-light'),
    base: read('--color-cloud'),
    shadow: read('--color-cloud-shadow'),
    flashes: [read('--color-cloud-flash'), read('--color-cloud-flash-alt')],
  }
}

/** The colours live in CSS (tokens.css), so re-read them whenever the theme changes. */
function useCloudColors(): CloudColors {
  const [colors, setColors] = useState(readColors)

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return colors
}

/**
 * One puff: a see-through base plus a denser top, the "puffy cloud" recipe
 * from the drei examples. Fixed seeds keep the shape identical on every visit.
 * Low `speed`: drei also spins each sprite with it, and the texture has its
 * shading baked in, so a fast spin makes dark patches crawl over light ones.
 * Shallow depth (z bounds) so a puff's sprites stay inside its own layer.
 * The top layer gets a lighter tone than the base, like sunlit cumulus.
 *
 * Each layer is its own <Clouds> with a fixed draw order (base, then top).
 * A <Clouds> sorts its sprites by distance every frame; with both tones in
 * one, a moving, spinning puff keeps flipping light and dark sprites, which
 * reads as flicker. The <Clouds> stay still and the groups inside them move:
 * drei places sprites relative to their <Clouds>, so it works either way,
 * but a moving <Clouds> would lag a frame behind.
 */
function Puff({
  seed,
  baseColor,
  topColor,
  order,
  layerRef,
}: {
  seed: number
  baseColor: string
  topColor: string
  /** Draw order of the base; the top draws right after it. */
  order: number
  layerRef: (layer: 0 | 1) => (group: Group | null) => void
}) {
  return (
    <>
      <Clouds renderOrder={order} limit={BASE_SPRITES} texture={TEXTURE} material={MeshLambertMaterial}>
        <group ref={layerRef(0)}>
          <Cloud
            seed={seed}
            segments={BASE_SPRITES}
            bounds={[1.4, 0.9, 0.3]}
            volume={2.6}
            speed={0.04}
            growth={1.5}
            color={baseColor}
          />
        </group>
      </Clouds>
      <Clouds renderOrder={order + 1} limit={TOP_SPRITES} texture={TEXTURE} material={MeshLambertMaterial}>
        <group ref={layerRef(1)}>
          <Cloud
            seed={seed + 1}
            segments={TOP_SPRITES}
            bounds={[1.6, 0.5, 0.3]}
            volume={3}
            speed={0.08}
            growth={1.5}
            position={[0, 0.35, 0]}
            color={topColor}
          />
        </group>
      </Clouds>
    </>
  )
}

function Storm({ cloudBreak, colors }: { cloudBreak: RefObject<CloudBreak>; colors: CloudColors }) {
  const puffs = useMemo(
    () => createPuffs(Array.from({ length: PUFF_COUNT }, (_, i) => ringPosition(i, PUFF_COUNT, 0))),
    [],
  )
  // Per puff, the groups of its two layers (base and top), moved together.
  const groups = useRef<[Group | null, Group | null][]>([])
  const light = useRef<PointLight>(null)
  // The puff that was hit hardest, so the next flash strikes there.
  const struck = useRef<PuffBody | null>(null)
  const wasFlashing = useRef(false)
  // Seconds of simulated time. The orbit runs on it instead of the clock: when
  // frames are slow, dt is clamped and the physics falls behind the clock, and
  // the puffs would cut across the middle chasing an orbit running ahead.
  const simTime = useRef(0)
  // Same settings as Puffycloud: bursts of up to 10 short flashes, plus a
  // spontaneous burst every few seconds, so the storm never fully sleeps.
  const [flash] = useState(() => new random.FlashGen({ count: 15, minDuration: 40, maxDuration: 200 , minInterval: 1500, maxInterval: 3500 }))
  const viewport = useThree((state) => state.viewport)
  // No lower limit: on a phone the whole cloud must still fit the width.
  const scale = Math.min(1, viewport.width / DESIGN_WIDTH)

  useFrame((state, delta) => {
    // A long frame (e.g. after switching tabs) would make the springs explode.
    const dt = Math.min(delta, 1 / 30)
    const time = state.clock.elapsedTime
    simTime.current += dt

    // At progress 1 the name is big enough to push every puff, smoke
    // included, past the screen's corners.
    const offScreen = Math.hypot(viewport.width, viewport.height) / 2 / scale + PUFF_EXTENT
    // The rest positions go round the ring; the springs drag the puffs after them.
    puffs.forEach((puff, i) => {
      ;[puff.homeX, puff.homeY] = ringPosition(i, PUFF_COUNT, simTime.current)
    })
    stepPuffs(puffs, cloudBreak.current.progress * pusherRadiusToClear(offScreen), dt)

    let hardest = puffs[0]
    puffs.forEach((puff, i) => {
      if (puff.impact > hardest.impact) hardest = puff
      // A slight shiver on top of the physics, different for each puff.
      for (const group of groups.current[i] ?? []) {
        group?.position.set(
          puff.x + Math.sin(time * 1.3 + i) * 0.05,
          puff.y + Math.cos(time * 1.7 + i * 2) * 0.05,
          depthOf(i),
        )
        // Spinning on itself, each at a slightly different pace.
        group?.rotation.set(0, 0, (i % 2 ? -1 : 1) * SPIN * (1 + i * 0.1) * simTime.current)
      }
    })

    if (hardest.impact > FLASH_IMPACT) {
      flash.burst()
      struck.current = hardest
    }
    const intensity = flash.update(time, dt)

    // Every new flash strikes from a new spot (the puff that was just hit,
    // otherwise a random one, from a random angle) in one of the two colours.
    if (flash.isFlashing && !wasFlashing.current && light.current) {
      light.current.color.set(colors.flashes[Math.random() < 0.5 ? 0 : 1])
      const target = struck.current ?? puffs[Math.floor(Math.random() * puffs.length)]
      let centreX = 0
      let centreY = 0
      for (const puff of puffs) {
        centreX += puff.x / puffs.length
        centreY += puff.y / puffs.length
      }
      const angle = Math.random() * Math.PI * 2
      light.current.position.set(
        target.x + (centreX - target.x) * FLASH_INWARD + Math.cos(angle) * FLASH_SPREAD,
        target.y + (centreY - target.y) * FLASH_INWARD + Math.sin(angle) * FLASH_SPREAD,
        // Never behind the puff: the sprites face the camera, so a light behind them lights nothing.
        depthOf(puffs.indexOf(target)) + FLASH_DEPTH,
      )
      struck.current = null
    }
    wasFlashing.current = flash.isFlashing

    if (light.current) light.current.intensity = intensity * FLASH_INTENSITY
  })

  return (
    <group scale={scale}>
      {/* Its colour and position change per flash, in useFrame. */}
      <pointLight ref={light} intensity={0} decay={1} distance={FLASH_REACH} position={[0, 0, 0.8]} />
      {/* Fixed draw order between puffs too, back ones first: as they move
          past each other, sorting them by distance would flip it.
          Shading by depth, since the puffs swap top and bottom as they go
          round: front puffs base → light, back puffs shadow → base. */}
      {Array.from({ length: PUFF_COUNT }, (_, i) => (
        <Puff
          key={i}
          seed={i * 2 + 1}
          order={2 * ((depthOf(i) < 0 ? 0 : PUFF_COUNT) + i)}
          baseColor={depthOf(i) < 0 ? colors.shadow : colors.base}
          topColor={depthOf(i) < 0 ? colors.base : colors.light}
          layerRef={(layer) => (group) => {
            groups.current[i] ??= [null, null]
            groups.current[i][layer] = group
          }}
        />
      ))}
    </group>
  )
}

function Scene({ cloudBreak }: { cloudBreak: RefObject<CloudBreak> }) {
  const colors = useCloudColors()

  return (
    <>
      {/* Soft fill plus a light from above, so the top of each puff is brighter. */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[-2, 6, 4]} intensity={1.6} />
      {/* useTexture suspends until the sprite is loaded. */}
      <Suspense fallback={null}>
        <Storm cloudBreak={cloudBreak} colors={colors} />
      </Suspense>
    </>
  )
}

/**
 * Stormy 3D cloud covering the Hero on load; scrolling breaks it apart.
 * Default export so the Hero can lazy-load it: three.js stays out of the
 * main bundle. Purely decorative, hence aria-hidden.
 */
export default function HeroCloud({ cloudBreak }: { cloudBreak: RefObject<CloudBreak> }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapper)

  return (
    <div ref={wrapper} className={styles.cloud} aria-hidden="true">
      {/* Off screen nothing runs: no physics, no lightning, no GPU work. */}
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 16], fov: 35 }}
      >
        <Scene cloudBreak={cloudBreak} />
      </Canvas>
    </div>
  )
}
