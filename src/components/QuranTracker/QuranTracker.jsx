import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  selectDailyDataMap,
  selectQuranJuz,
  selectSelectedDay,
  updateDailyData,
  updateSection
} from '../../store/ramadanSlice'
import styles from './QuranTracker.module.css'

function QuranTracker() {
  const dispatch = useDispatch()
  const location = useLocation()
  const juzData = useSelector(selectQuranJuz)
  const selectedDay = useSelector(selectSelectedDay)
  const dayData = useSelector((state) => state.ramadan.dailyData?.[selectedDay]) || {}
  const dailyDataMap = useSelector(selectDailyDataMap)

  // Note: Page counts vary by Mushaf edition. Adjust this list to match yours.
  // This default distributes 604 pages across 30 Juz (average ~20 pages each).
  const juzPages = [
    21, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 23
  ]

  const juzList = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    pages: juzPages[i] ?? 20
  }))

  const toggleJuz = (juzNumber) => {
    const nextDone = !juzData?.[juzNumber]
    dispatch(updateSection({ section: 'quranJuz', data: { [juzNumber]: nextDone } }))

    // Sync back into any assigned day(s) so Daily Tracker reflects the same change.
    const dayNums = Array.from({ length: 30 }, (_, i) => i + 1)
    for (const day of dayNums) {
      const prev = dailyDataMap?.[day]?.addedJuz
      if (!Array.isArray(prev)) continue
      const hasThisJuz = prev.some((x) => Number(x?.juzNumber) === Number(juzNumber))
      if (!hasThisJuz) continue
      const next = prev.map((x) =>
        Number(x?.juzNumber) === Number(juzNumber) ? { ...x, done: nextDone } : x
      )
      dispatch(updateDailyData({ day, data: { addedJuz: next } }))
    }
  }

  // Build a global "which day owns which Juz" map so a Juz can't be added to multiple days.
  const juzAssignedDay = useMemo(() => {
    const map = {}
    const dayNums = Array.from({ length: 30 }, (_, i) => i + 1)
    for (const day of dayNums) {
      const added = dailyDataMap?.[day]?.addedJuz
      if (!Array.isArray(added)) continue
      for (const entry of added) {
        const n = Number(entry?.juzNumber)
        if (!Number.isFinite(n)) continue
        // Keep the first assignment we see.
        if (!map[n]) map[n] = day
      }
    }
    return map
  }, [dailyDataMap])

  const addJuzToCurrentDay = (juz) => {
    const prev = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []
    const exists = prev.some((x) => Number(x?.juzNumber) === Number(juz.number))
    const next = exists ? prev : [...prev, { juzNumber: juz.number, pages: juz.pages, done: false }]
    dispatch(updateDailyData({ day: selectedDay, data: { addedJuz: next } }))
  }

  const removeJuzFromCurrentDay = (juzNumber) => {
    const prev = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []
    const next = prev.filter((x) => Number(x?.juzNumber) !== Number(juzNumber))
    dispatch(updateDailyData({ day: selectedDay, data: { addedJuz: next } }))
  }

  const completedJuz = Object.values(juzData).filter(Boolean).length

  const renderJuzCard = (juz) => {
    const assignedDay = juzAssignedDay?.[juz.number]
    const isAddedToSomeDay = Number.isFinite(Number(assignedDay))
    const isAddedToCurrentDay = Number(assignedDay) === Number(selectedDay)
    const isCompleted = !!juzData?.[juz.number]

    return (
      <div key={juz.number} className={`${styles.juzCard} ${isCompleted ? styles.juzCardCompleted : ''}`}>
        <div className={styles.juzCardHeader}>
          <div className={styles.juzCardTitle}>Juz' {juz.number}</div>
          <div className={styles.juzCardMeta}>{juz.pages} pages</div>
        </div>

        <div className={styles.juzCardRow}>
          <span className={styles.juzCardLabel}>Completed</span>
          <label className={styles['juz-checkbox']}>
            <input type="checkbox" checked={isCompleted} onChange={() => toggleJuz(juz.number)} />
            <span className={styles.checkmark}></span>
          </label>
        </div>

        <div className={styles.juzCardRow}>
          <span className={styles.juzCardLabel}>Assigned day</span>
          <span className={styles.juzCardValue}>{assignedDay ? `Day ${assignedDay}` : '-'}</span>
        </div>

        <div className={styles.juzCardActions}>
          <button
            type="button"
            className={styles['adhkar-add-btn']}
            disabled={isCompleted || (isAddedToSomeDay && !isAddedToCurrentDay)}
            onClick={() => {
              if (isCompleted) return
              if (isAddedToSomeDay && !isAddedToCurrentDay) return
              if (isAddedToCurrentDay) removeJuzFromCurrentDay(juz.number)
              else addJuzToCurrentDay(juz)
            }}
          >
            {isCompleted
              ? 'Completed'
              : isAddedToSomeDay && !isAddedToCurrentDay
                ? `Added to day - ${assignedDay}`
                : isAddedToCurrentDay
                  ? `Remove from current day - ${selectedDay}`
                  : `Add to current day - ${selectedDay}`}
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (location.hash === '#quran-top') {
      const el = document.getElementById('quran-top')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <div className={`${styles['quran-tracker']} card`} id="quran-top">
      <div className={styles['quran-header']}>
        <h2>Quran Tracker</h2>
        <div className={styles['progress-summary']}>
          <span>{completedJuz} / 30 Juz's</span>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']} style={{ width: `${(completedJuz / 30) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Desktop: tables */}
      <div className={styles.desktopTables}>
        <div className={styles['quran-tables']}>
          <div className={styles['quran-table-section']}>
          <h3>Juz's 1-15</h3>
          <table className={styles['quran-table']}>
            <thead>
              <tr>
                <th>Juz</th>
                <th>Pages</th>
                <th>Completed ✓</th>
                <th>Assigned Day</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {juzList.slice(0, 15).map((juz) => {
                const assignedDay = juzAssignedDay?.[juz.number]
                const isAddedToSomeDay = Number.isFinite(Number(assignedDay))
                const isAddedToCurrentDay = Number(assignedDay) === Number(selectedDay)
                const isCompleted = !!juzData?.[juz.number]

                return (
                  <tr key={juz.number} className={juzData[juz.number] ? styles.completed : ''}>
                    <td>{juz.number}</td>
                    <td>{juz.pages}</td>
                    <td>
                      <label className={styles['juz-checkbox']}>
                        <input
                          type="checkbox"
                          checked={juzData[juz.number] || false}
                          onChange={() => toggleJuz(juz.number)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </td>
                    <td>{assignedDay ? `Day ${assignedDay}` : '-'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles['adhkar-add-btn']}
                        disabled={isCompleted || (isAddedToSomeDay && !isAddedToCurrentDay)}
                        onClick={() => {
                          if (isCompleted) return
                          if (isAddedToSomeDay && !isAddedToCurrentDay) return
                          if (isAddedToCurrentDay) removeJuzFromCurrentDay(juz.number)
                          else addJuzToCurrentDay(juz)
                        }}
                      >
                        {isCompleted
                          ? 'Completed'
                          : isAddedToSomeDay && !isAddedToCurrentDay
                            ? `Added to day - ${assignedDay}`
                            : isAddedToCurrentDay
                              ? `Remove from current day - ${selectedDay}`
                              : `Add to current day - ${selectedDay}`}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>

          <div className={styles['quran-table-section']}>
          <h3>Juz's 16-30</h3>
          <table className={styles['quran-table']}>
            <thead>
              <tr>
                <th>Juz'</th>
                <th>Pages</th>
                <th>Completed ✓</th>
                <th>Assigned Day</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {juzList.slice(15).map((juz) => {
                const assignedDay = juzAssignedDay?.[juz.number]
                const isAddedToSomeDay = Number.isFinite(Number(assignedDay))
                const isAddedToCurrentDay = Number(assignedDay) === Number(selectedDay)
                const isCompleted = !!juzData?.[juz.number]

                return (
                  <tr key={juz.number} className={juzData[juz.number] ? styles.completed : ''}>
                    <td>{juz.number}</td>
                    <td>{juz.pages}</td>
                    <td>
                      <label className={styles['juz-checkbox']}>
                        <input
                          type="checkbox"
                          checked={juzData[juz.number] || false}
                          onChange={() => toggleJuz(juz.number)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </td>
                    <td>{assignedDay ? `Day ${assignedDay}` : '-'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles['adhkar-add-btn']}
                        disabled={isCompleted || (isAddedToSomeDay && !isAddedToCurrentDay)}
                        onClick={() => {
                          if (isCompleted) return
                          if (isAddedToSomeDay && !isAddedToCurrentDay) return
                          if (isAddedToCurrentDay) removeJuzFromCurrentDay(juz.number)
                          else addJuzToCurrentDay(juz)
                        }}
                      >
                        {isCompleted
                          ? 'Completed'
                          : isAddedToSomeDay && !isAddedToCurrentDay
                            ? `Added to day - ${assignedDay}`
                            : isAddedToCurrentDay
                              ? `Remove from current day - ${selectedDay}`
                              : `Add to current day - ${selectedDay}`}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileCards}>
        <h3 className={styles.mobileCardsTitle}>All Juz's</h3>
        <div className={styles.juzCardsGrid}>{juzList.map(renderJuzCard)}</div>
      </div>
    </div>
  )
}

export default QuranTracker

