import styles from './NextBuild.module.css'

/** Terminal-style window marking the slot for the next project. */
export function NextBuild() {
  return (
    <article className={styles.window} aria-label="Next project, in progress">
      <div className={styles.titlebar} aria-hidden="true">
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.path}>~/projects/next</span>
      </div>
      <div className={styles.body}>
        <p>
          <span className={styles.prompt} aria-hidden="true">
            $
          </span>
          build next-project
        </p>
        <div className={styles.progressRow}>
          <div
            className={styles.track}
            role="progressbar"
            aria-label="Next project"
            aria-valuetext="In progress"
          >
            <div className={styles.fill} />
          </div>
          <span className={styles.muted}>building…</span>
        </div>
        <p className={styles.muted}>
          status: <span className={styles.status}>in progress</span>
        </p>
      </div>
    </article>
  )
}
