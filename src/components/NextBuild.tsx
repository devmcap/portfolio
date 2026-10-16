import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import styles from './NextBuild.module.css'

/** Terminal-style window marking the slot for the next project. The visible text stays in English. */
export function NextBuild() {
  const { lang } = useLanguage()

  return (
    <article className={styles.window} aria-label={ui.nextBuild[lang]}>
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
            aria-label={ui.nextBuildProgress[lang]}
            aria-valuetext={ui.inProgress[lang]}
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
