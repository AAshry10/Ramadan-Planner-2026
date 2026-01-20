import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectCurrentDay,
  selectImportantDates,
  selectSelectedDay,
  selectQuranJuz,
  setSelectedDay,
  updateDailyData,
  updateSection
} from '../../store/ramadanSlice'
import { getRamadanProgress, hasRamadanDayPassed } from '../../utils/ramadanDates'
import styles from './DailyTracker.module.css'

import TextAreaInput from './TextAreaInput/TextAreaInput'
import Sammary from './Sammary/Sammary'

const DEFAULT_DAY_DATA = {
  suhoor: [],
  iftar: [],
  prayers: {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    taraweeh: false,
    witr: false
  },
  quran: { start: '', end: '' },
  dua: [],
  charity: [],
  goodDeeds: '',
  mood: '',
  gratitude: [],
  selfImprovement: []
}

function DailyTracker() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const day = useSelector(selectSelectedDay)
  const currentDay = useSelector(selectCurrentDay)
  const quranJuz = useSelector(selectQuranJuz)
  const importantDates = useSelector(selectImportantDates)
  const dayData = useSelector((state) => state.ramadan.dailyData?.[day]) || DEFAULT_DAY_DATA
  const isNightBeforeOddLastTen = day >= 20 && day <= 28 && day % 2 === 0

  const { phase } = getRamadanProgress(importantDates?.ramadanStart, new Date())
  const isPassedDay = hasRamadanDayPassed(day, importantDates?.ramadanStart, new Date())
  
  const addedDhikr = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
  const addedJuz = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []

  const prayers = [
    { name: 'Fajr', key: 'fajr' },
    { name: 'Dhuhr', key: 'dhuhr' },
    { name: 'Asr', key: 'asr' },
    { name: 'Maghrib', key: 'maghrib' },
    { name: 'Isha', key: 'isha' },
    { name: 'Taraweeh', key: 'taraweeh' },
    { name: 'Witr', key: 'witr' }
  ]

  const handlePrayerToggle = (prayer) => {
    dispatch(
      updateDailyData({
        day,
        data: {
          prayers: {
            ...(dayData.prayers || DEFAULT_DAY_DATA.prayers),
            [prayer]: !(dayData.prayers || DEFAULT_DAY_DATA.prayers)[prayer]
          }
        }
      })
    )
  }

  const toggleAddedDhikrDone = (id) => {
    const prev = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
    const next = prev.map((x) => (x?.id === id ? { ...x, done: !x?.done } : x))
    dispatch(updateDailyData({ day, data: { addedDhikr: next } }))
  }

  const toggleAddedJuzDone = (juzNumber) => {
    const prev = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []
    let nextDone = false
    const next = prev.map((x) => {
      if (Number(x?.juzNumber) !== Number(juzNumber)) return x
      nextDone = !x?.done
      return { ...x, done: nextDone }
    })

    dispatch(updateDailyData({ day, data: { addedJuz: next } }))
    // Sync with Quran Tracker completion + progress
    dispatch(updateSection({ section: 'quranJuz', data: { [juzNumber]: nextDone } }))
  }

  const removeAddedDhikr = (id) => {
    const prev = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
    const next = prev.filter((x) => x?.id !== id)
    dispatch(updateDailyData({ day, data: { addedDhikr: next } }))
  }

  const removeAddedJuz = (juzNumber) => {
    const prev = Array.isArray(dayData?.addedJuz) ? dayData.addedJuz : []
    const next = prev.filter((x) => Number(x?.juzNumber) !== Number(juzNumber))
    dispatch(updateDailyData({ day, data: { addedJuz: next } }))
    // Keep Quran tracker progress in sync (removing from day unchecks completion)
    dispatch(updateSection({ section: 'quranJuz', data: { [juzNumber]: false } }))
  }

  return (
    <div className={`${styles['daily-tracker']} card`}>

      <div className={styles['daily-header']}>
        <h2>Day {day} of 30</h2>
        <div className={styles['day-navigation']}>
          <button onClick={() => dispatch(setSelectedDay(Math.max(1, day - 1)))}>← Prev</button>
          <button onClick={() => dispatch(setSelectedDay(Math.min(30, day + 1)))}>Next →</button>
        </div>
      </div>

      {isNightBeforeOddLastTen && (
        <div className={styles['lq-night-note']}>
          <span className={styles['lq-night-note-icon']}>🌙</span>
          <span>Go harder this night — it may be Laylatul Qadr.</span>
        </div>
      )}

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Suhoor Plan"
        placeholder="What will you eat for Suhoor?"
        rows={2}
        value={dayData?.suhoor}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { suhoor: next } }))}
      />

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Iftar Plan"
        placeholder="What will you eat for Iftar?"
        rows={2}
        value={dayData?.iftar}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { iftar: next } }))}
      />

      <div className={styles['tracker-section']}>
        <h3>Prayers For Today</h3>
        <div className={styles['prayers-grid']}>
          {prayers.map((prayer) => (
            <label key={prayer.key} className={styles['prayer-checkbox']}>
              <input
                type="checkbox"
                checked={dayData.prayers?.[prayer.key] || false}
                onChange={() => handlePrayerToggle(prayer.key)}
              />
              <span className={styles.checkmark}></span>
              <span className={styles['prayer-name']}>{prayer.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles['tracker-section']}>
        <h3>Qur'an Reading</h3>
        <button type="button" className={styles['adhkar-nav-btn']} onClick={() => navigate('/quran#quran-top')}>
          Go to Quran Tracker
        </button>

        {addedJuz.length > 0 && (
          <div className={styles['added-dhikr']}>
            <h4 className={styles['added-dhikr-title']}>Added Juz's for Day {day}</h4>
            <div className={styles['added-juz-list']}>
              {addedJuz.map((j, idx) => (
                <div key={`${j?.juzNumber || 'juz'}-${idx}`} className={styles['added-juz-item']}>
                  <label className={styles['added-item-check']}>
                    <input type="checkbox" checked={!!j?.done} onChange={() => toggleAddedJuzDone(j?.juzNumber)} />
                    <span className={styles.checkmark}></span>
                    <span>Juz' {j?.juzNumber}</span>
                  </label>
                  {Number.isFinite(Number(j?.pages)) && <span>({Number(j.pages)} pages)</span>}
                  {!quranJuz?.[j?.juzNumber] && (
                    <button type="button" className={styles['remove-added-btn']} onClick={() => removeAddedJuz(j?.juzNumber)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Dua' For Today"
        placeholder="Write your dua's for today..."
        rows={3}
        value={dayData?.dua}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { dua: next } }))}
        after={
          <>
            <button type="button" className={styles['adhkar-nav-btn']} onClick={() => navigate('/adhkar#athkar-top')}>
              Go to Adhkar
            </button>

            {addedDhikr.length > 0 && (
              <div className={styles['added-dhikr']}>
                <h4 className={styles['added-dhikr-title']}>Added dhikr for Day {day}</h4>
                <div className={styles['adhkar-list']}>
                  {addedDhikr.map((item, idx) => (
                    <div key={`${item?.id || 'added'}-${idx}`} className={styles['adhkar-item']}>
                      <div className={styles['adhkar-content']}>
                        <div className={styles['adhkar-row']}>
                          <label className={styles['added-item-check']}>
                            <input
                              type="checkbox"
                              checked={!!item?.done}
                              onChange={() => toggleAddedDhikrDone(item?.id)}
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          {Number.isFinite(Number(item?.count)) && (
                            <span className={styles['adhkar-count']}>x{Number(item.count)}</span>
                          )}
                          <button
                            type="button"
                            className={styles['remove-added-btn']}
                            onClick={() => removeAddedDhikr(item?.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <span className={styles['adhkar-arabic']}>{item?.textAr || ''}</span>
                        <span className={styles['adhkar-english']}>{item?.textEn || ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        }
      />

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Charity / Good Deeds"
        placeholder="Record your charity and good deeds..."
        rows={3}
        value={dayData?.charity}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { charity: next } }))}
      />

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Gratitude Notes"
        placeholder="What are you grateful for today?"
        rows={4}
        value={dayData?.gratitude}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { gratitude: next } }))}
      />

      <TextAreaInput
        resetKey={day}
        wrapperClassName={styles['tracker-section']}
        title="Self-Improvement Notes"
        placeholder="Reflect on your day and areas for improvement..."
        rows={4}
        value={dayData?.selfImprovement}
        onUpdate={(next) => dispatch(updateDailyData({ day, data: { selfImprovement: next } }))}
      />

      {isPassedDay && (
        <Sammary
          day={day}
          dayData={dayData}
          quranJuz={quranJuz}
          currentDay={currentDay}
          phase={phase}
        />
      )}
    </div>
  )
}

export default DailyTracker

