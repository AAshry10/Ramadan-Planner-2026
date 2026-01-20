import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import athkarData from '../../jsonDB/Athkar.json'
import { selectSelectedDay, updateDailyData } from '../../store/ramadanSlice'
import AdhkarItem from './AdhkarItem'
import styles from './Adhkar.module.css'

function Adhkar() {
  const location = useLocation() 
  const dispatch = useDispatch()
  const selectedDay = useSelector(selectSelectedDay)
  const dayData = useSelector((state) => state.ramadan.dailyData?.[selectedDay]) || {}

  const morningAndEveningAdhkar = Array.isArray(athkarData?.morningAndEvening) ? athkarData.morningAndEvening : []
  const adanAdhkar = Array.isArray(athkarData?.Adan) ? athkarData.Adan : []
  const prayerAdhkar = Array.isArray(athkarData?.Prayer) ? athkarData.Prayer : []
  const wdouAdhkar = Array.isArray(athkarData?.["Wdou'"]) ? athkarData["Wdou'"] : []

  const buildDhikrId = (item) => {
    const textAr = item?.textAr || item?.text || ''
    const textEn = item?.textEn || ''
    const count = Number(item?.count)
    return `${textAr}||${textEn}||${Number.isFinite(count) ? count : ''}`
  }

  const addedDhikr = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
  const addedDhikrIds = new Set(addedDhikr.map((x) => x?.id).filter(Boolean))

  const addDhikrToCurrentDay = (item) => {
    const prev = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
    const id = item?.id || buildDhikrId(item)
    const exists = prev.some((x) => x?.id === id)
    const next = exists ? prev : [...prev, { ...item, id, done: false }]
    dispatch(updateDailyData({ day: selectedDay, data: { addedDhikr: next } }))
  }

  const removeDhikrFromCurrentDay = (item) => {
    const prev = Array.isArray(dayData?.addedDhikr) ? dayData.addedDhikr : []
    const id = item?.id || buildDhikrId(item)
    const next = prev.filter((x) => x?.id !== id)
    dispatch(updateDailyData({ day: selectedDay, data: { addedDhikr: next } }))
  }

  useEffect(() => {
    if (location.hash === '#athkar-top') {
      const el = document.getElementById('athkar-top')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <div className={`${styles.adhkar} card`} id="athkar-top">
      <h2>Adhkar (Dhikr)</h2>

      <div className={styles['adhkar-section']}>
        <h3>Morning & Evining Adhkar (اذكار الصباح و المساء)</h3>
        <div className={styles['adhkar-list']}>
          {morningAndEveningAdhkar.map((item, idx) => (
            <AdhkarItem
              key={`${item?.id || buildDhikrId(item) || 'morning'}-${idx}`}
              item={item}
              showAddButton
              isAdded={addedDhikrIds.has(item?.id || buildDhikrId(item))}
              addButtonLabel={`Add to current day - ${selectedDay}`}
              removeButtonLabel={`Remove from current day - ${selectedDay}`}
              onAdd={addDhikrToCurrentDay}
              onRemove={removeDhikrFromCurrentDay}
            />
          ))}
        </div>
      </div>

      <div className={styles['adhkar-section']}>
        <h3>Adhan Dhikr (ذكر الأذان)</h3>
        <div className={styles['adhkar-list']}>
          {adanAdhkar?.map((item, idx) => (
            <AdhkarItem
              key={`${item?.id || buildDhikrId(item) || 'adan'}-${idx}`}
              item={item}
              showAddButton
              isAdded={addedDhikrIds.has(item?.id || buildDhikrId(item))}
              addButtonLabel={`Add to current day - ${selectedDay}`}
              removeButtonLabel={`Remove from current day - ${selectedDay}`}
              onAdd={addDhikrToCurrentDay}
              onRemove={removeDhikrFromCurrentDay}
            />
          ))}
        </div>
      </div>

      <div className={styles['adhkar-section']}>
        <h3>Prayer Dhikr (اذكار الصلاة)</h3>
        <div className={styles['adhkar-list']}>
          {prayerAdhkar?.map((item, idx) => (
            <AdhkarItem
              key={`${item?.id || buildDhikrId(item) || 'prayer'}-${idx}`}
              item={item}
              showAddButton
              isAdded={addedDhikrIds.has(item?.id || buildDhikrId(item))}
              addButtonLabel={`Add to current day - ${selectedDay}`}
              removeButtonLabel={`Remove from current day - ${selectedDay}`}
              onAdd={addDhikrToCurrentDay}
              onRemove={removeDhikrFromCurrentDay}
            />
          ))}
        </div>
      </div>

      <div className={styles['adhkar-section']}>
        <h3>Wdou' Dhikr (اذكار الوضوء)</h3>
        <div className={styles['adhkar-list']}>
          {wdouAdhkar?.map((item, idx) => (
            <AdhkarItem
              key={`${item?.id || buildDhikrId(item) || 'wdou'}-${idx}`}
              item={item}
              showAddButton
              isAdded={addedDhikrIds.has(item?.id || buildDhikrId(item))}
              addButtonLabel={`Add to current day - ${selectedDay}`}
              removeButtonLabel={`Remove from current day - ${selectedDay}`}
              onAdd={addDhikrToCurrentDay}
              onRemove={removeDhikrFromCurrentDay}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Adhkar

