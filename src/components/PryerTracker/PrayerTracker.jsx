import { useDispatch, useSelector } from 'react-redux'
import { selectDailyDataMap, updateDailyData } from '../../store/ramadanSlice'
import styles from './PrayerTracker.module.css'

function PrayerTracker() {
  const dispatch = useDispatch()
  const dailyDataMap = useSelector(selectDailyDataMap)

  // Keep these aligned with DailyTracker "Acts of Worship" (first 5 prayers only)
  const prayers = [
    { name: 'Fajr', key: 'fajr' },
    { name: 'Dhuhr', key: 'dhuhr' },
    { name: 'Asr', key: 'asr' },
    { name: 'Maghrib', key: 'maghrib' },
    { name: 'Isha', key: 'isha' }
  ]

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  const isPrayerCompleted = (day, prayerKey) => {
    return !!dailyDataMap?.[day]?.prayers?.[prayerKey]
  }

  const togglePrayer = (day, prayerKey) => {
    const prevPrayers = dailyDataMap?.[day]?.prayers || {}
    dispatch(
      updateDailyData({
        day,
        data: {
          prayers: {
            ...prevPrayers,
            [prayerKey]: !prevPrayers[prayerKey]
          }
        }
      })
    )
  }

  return (
    <div className={`${styles['prayer-tracker']} card`}>
      <h2>Prayer Tracker</h2>
      
      <div className={styles['prayer-table-wrapper']}>
        <table className={styles['prayer-table']}>
          <thead>
            <tr>
              <th>Prayer</th>
              {days.map((day) => (
                <th key={day}>{day}-Ramadan</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prayers.map((prayer) => (
              <tr key={prayer.key}>
                <td className={styles['prayer-name-cell']}>{prayer.name}</td>
                {days.map((day) => {
                  const completed = isPrayerCompleted(day, prayer.key)
                  return (
                    <td key={day}>
                      <label className={styles['prayer-cell-checkbox']}>
                        <input
                          type="checkbox"
                          checked={completed}
                          onChange={() => togglePrayer(day, prayer.key)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PrayerTracker

