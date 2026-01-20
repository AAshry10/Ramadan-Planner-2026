import { useDispatch, useSelector } from 'react-redux'
import { selectEidChecklist, updateSection } from '../../store/ramadanSlice'
import styles from './EidChecklist.module.css'

function EidChecklist() {
  const dispatch = useDispatch()
  const checklist = useSelector(selectEidChecklist)

  const items = [
    { id: 'outfit', label: 'Eid outfit ready' },
    { id: 'gifts', label: 'Gifts prepared' },
    { id: 'house', label: 'House preparation' },
    { id: 'zakat', label: 'Charity / Zakat Al-Fitr done' },
    { id: 'family', label: 'Family plans arranged' }
  ]

  const toggleItem = (id) => {
    dispatch(updateSection({ section: 'eidChecklist', data: { [id]: !checklist[id] } }))
  }

  const completedCount = items.filter((item) => checklist[item.id]).length

  return (
    <div className={`${styles['eid-checklist']} card`}>
      <div className={styles['eid-header']}>
        <h2>Eid Preparation Checklist</h2>
        <div className={styles['completion-status']}>
          {completedCount} / {items.length} Completed
        </div>
      </div>

      <div className={styles['checklist-items']}>
        {items.map((item) => (
          <label key={item.id} className={styles['checklist-item']}>
            <input
              type="checkbox"
              checked={checklist[item.id] || false}
              onChange={() => toggleItem(item.id)}
            />
            <span className={styles.checkmark}></span>
            <span className={styles['item-label']}>{item.label}</span>
          </label>
        ))}
      </div>

      {completedCount === items.length && (
        <div className={styles['completion-message']}>
          🎉 All set for Eid! May Allah accept your fasting and good deeds.
        </div>
      )}
    </div>
  )
}

export default EidChecklist

