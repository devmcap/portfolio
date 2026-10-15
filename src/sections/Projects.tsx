import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { projects } from '../data/projects'
import styles from './Projects.module.css'

export function Projects() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="projects" className={styles.projects}>
      <h2 data-reveal className={styles.heading}>
        Proyectos
      </h2>
      {projects.map((project) => (
        <article key={project.id} data-reveal className={styles.card}>
          <span className={styles.year}>{project.year}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </article>
      ))}
    </section>
  )
}
