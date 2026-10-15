import { Nav } from './components/Nav'
import { SmoothScroll } from './components/SmoothScroll'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'

// Each section is one "chapter" of the scroll story, rendered in order.
export default function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
    </SmoothScroll>
  )
}
