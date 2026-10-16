import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { NextBuild } from '../components/NextBuild'
import { projects } from '../data/projects'
import { ui } from '../data/ui'
import typography from '../styles/typography.module.css'
import styles from './Projects.module.css'

export function Projects() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="projects" className={styles.projects}>
      <h2 data-reveal className={`${typography.label} ${styles.label}`}>
        {ui.projectsTitle.en}
      </h2>
      {projects.map((project) => (
        <article key={project.id} data-reveal className={styles.card}>
          <span className={styles.year}>{project.year}</span>
          <h3>{project.title}</h3>
          <p>{project.description.en}</p>
          <p className={styles.stack}>{project.stack.join(' · ')}</p>
          <a href={project.repo} className={styles.link} target="_blank" rel="noreferrer">
            {ui.viewRepo.en}
          </a>
        </article>
      ))}
      <div data-reveal className={styles.next}>
        <NextBuild />
      </div>
    </section>
  )
}
