import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectCurrentDay,
  selectDailyDataMap,
  selectQuranJuz,
  selectImportantDates,
  selectSelectedDay,
  setSelectedDay
} from '../../store/ramadanSlice'
import { getRamadanProgress } from '../../utils/ramadanDates'
import styles from './CalendarGrid.module.css'

function CalendarGrid() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ClassConcat = (...classes) => classes.filter(Boolean).join(' ')

  const currentDay = useSelector(selectCurrentDay)
  const selectedDay = useSelector(selectSelectedDay)
  const dailyData = useSelector(selectDailyDataMap)
  const quranJuz = useSelector(selectQuranJuz)
  const importantDates = useSelector(selectImportantDates)

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  const getDayStatus = (day) => {
    const { diffDays, phase } = getRamadanProgress(importantDates?.ramadanStart, new Date())

    // Time-based: a day is "complete" iff it has actually passed.
    if (phase === 'before') return 'empty'
    if (phase === 'after') return 'complete'

    // during
    if (Number(day) < Number(diffDays)) return 'complete'
    if (Number(day) === Number(diffDays)) return 'partial'
    return 'empty'
  }

  return (
    <div className={`${styles['calendar-grid']} card`}>
      <h2>Ramadan Calendar</h2>

      <div className={styles['calendar-days']}>
        {days.map((day) => {
          const status = getDayStatus(day)
          const isCurrent = day === currentDay
          const isSelected = day === selectedDay
          
          // Night of an odd day starts after Maghrib of the previous (even) day.
          // So we mark even days 20,22,24,26,28 (nights leading into 21,23,25,27,29).
          const isNightBeforeOddLastTen = day >= 20 && day <= 28 && day % 2 === 0

          return (
            <button
              key={day}
              className={ClassConcat(
                styles['calendar-day'],
                styles[status],
                isCurrent && styles.current,
                isSelected && styles.selected,
                isNightBeforeOddLastTen && styles['lq-night']
              )}
              onClick={() => {
                dispatch(setSelectedDay(day))
                navigate('/daily')
              }}
              title={isNightBeforeOddLastTen ? 'Night before an odd day in the last 10 (Laylatul Qadr candidate)' : undefined}
            >
              <span className={styles['day-number']}>{day}</span>
              {isNightBeforeOddLastTen && <span className={styles['lq-night-badge']}>🌙</span>}
              {status === 'complete' && <span className={styles['status-icon']}>✓</span>}
              {status === 'partial' && <span className={styles['status-icon']}>•••</span>}
              {isCurrent && <span className={styles['current-badge']}>Today</span>}
            </button>
          )
        })}
      </div>
      
      <div className={styles['calendar-legend']}>
        <div className={styles['legend-item']}>
          <span className={ClassConcat(styles['legend-color'], styles.complete)}></span>
          <span>Complete Day</span>
        </div>
        <div className={styles['legend-item']}>
          <span className={ClassConcat(styles['legend-color'], styles.partial)}></span>
          <span>Partial Progress</span>
        </div>
        <div className={styles['legend-item']}>
          <span className={ClassConcat(styles['legend-color'], styles.empty)}></span>
          <span>Not Started</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarGrid

