import type { ReactNode } from 'react'
import styles from './SpecList.module.css'

export interface SpecRow {
  label: string
  content: ReactNode
}

/** Spec-sheet style list: mono label on the left, value on the right. */
export function SpecList({ rows }: { rows: readonly SpecRow[] }) {
  return (
    <dl className={styles.list}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt>{row.label}</dt>
          <dd>{row.content}</dd>
        </div>
      ))}
    </dl>
  )
}
