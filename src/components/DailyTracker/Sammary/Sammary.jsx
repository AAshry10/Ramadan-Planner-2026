import styles from './Sammary.module.css'

function normalizeEntries(value) {
  if (Array.isArray(value)) {
    return value
      .map((x) => {
        if (typeof x === 'string') return x.trim()
        if (!x || typeof x !== 'object') return ''
        return String(x.text ?? x.value ?? '').trim()
      })
      .filter(Boolean)
  }
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  return []
}

export default function Sammary({ day, dayData, quranJuz }) {
  const prayersMap = dayData?.prayers || {}
  const prayerKeys = [
    { key: 'fajr', label: 'Fajr' },
    { key: 'dhuhr', label: 'Dhuhr' },
    { key: 'asr', label: 'Asr' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
    { key: 'taraweeh', label: 'Taraweeh' },
    { key: 'witr', label: 'Witr' }
  ]

  const prayersCompleted = prayerKeys.filter((p) => !!prayersMap?.[p.key]).map((p) => p.label)
  const prayersMissed = prayerKeys.filter((p) => !prayersMap?.[p.key]).map((p) => p.label)

  const addedJuz = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []
  const quranCompleted = []
  const quranMissed = []
  for (const entry of addedJuz) {
    const juzNumber = Number(entry?.juzNumber)
    if (!Number.isFinite(juzNumber)) continue
    const isDone = !!quranJuz?.[juzNumber] || !!entry?.done
    ;(isDone ? quranCompleted : quranMissed).push(`Juz ${juzNumber}`)
  }

  const charityItems = normalizeEntries(dayData?.charity)

  const dhikrItems = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
  const dhikrDone = dhikrItems.filter((d) => !!d?.done).length
  const dhikrMissed = dhikrItems.length - dhikrDone

  return (
    <div className={styles.summary}>
      <div className={styles.summaryCard}>
        <div className={styles.titleRow}>
          <h3>Day {day} Summary</h3>
          <span className={styles.badge}>Past day</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Prayers</p>
            <div className={styles.counts}>
              <span className={styles.chipOk}>{prayersCompleted.length} completed</span>
              <span className={styles.chipMiss}>{prayersMissed.length} missed</span>
            </div>
            {prayersCompleted.length > 0 ? (
              <>
                <p className={styles.muted}>Completed:</p>
                <ul className={styles.list}>
                  {prayersCompleted.map((p) => (
                    <li key={`p-ok-${p}`}>{p}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.muted}>No prayers recorded as completed.</p>
            )}
            {prayersMissed.length > 0 && (
              <>
                <p className={styles.muted}>Missed:</p>
                <ul className={styles.list}>
                  {prayersMissed.map((p) => (
                    <li key={`p-miss-${p}`}>{p}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Qur’an (Juz)</p>
            <div className={styles.counts}>
              <span className={styles.chipOk}>{quranCompleted.length} completed</span>
              <span className={styles.chipMiss}>{quranMissed.length} missed</span>
            </div>
            {addedJuz.length === 0 ? (
              <p className={styles.muted}>No Juz assigned to this day.</p>
            ) : (
              <>
                {quranCompleted.length > 0 && (
                  <>
                    <p className={styles.muted}>Completed:</p>
                    <ul className={styles.list}>
                      {quranCompleted.map((j) => (
                        <li key={`q-ok-${j}`}>{j}</li>
                      ))}
                    </ul>
                  </>
                )}
                {quranMissed.length > 0 && (
                  <>
                    <p className={styles.muted}>Missed:</p>
                    <ul className={styles.list}>
                      {quranMissed.map((j) => (
                        <li key={`q-miss-${j}`}>{j}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Charity / Good deeds</p>
            {charityItems.length > 0 ? (
              <>
                <div className={styles.counts}>
                  <span className={styles.chipOk}>{charityItems.length} items recorded</span>
                </div>
                <ul className={styles.list}>
                  {charityItems.map((t, idx) => (
                    <li key={`c-${idx}`} className={styles.textBlock}>
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.muted}>No charity / good deeds recorded.</p>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Dhikr</p>
            <div className={styles.counts}>
              <span className={styles.chipOk}>{dhikrDone} done</span>
              <span className={styles.chipMiss}>{Math.max(0, dhikrMissed)} missed</span>
            </div>
            {dhikrItems.length === 0 ? (
              <p className={styles.muted}>No added dhikr for this day.</p>
            ) : (
              <p className={styles.muted}>
                {dhikrDone} / {dhikrItems.length} marked as done.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

