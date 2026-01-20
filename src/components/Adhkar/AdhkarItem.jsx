import styles from './AdhkarItem.module.css'

function buildDhikrId(item) {
  const textAr = item?.textAr || item?.text || ''
  const textEn = item?.textEn || ''
  const count = Number(item?.count)
  return `${textAr}||${textEn}||${Number.isFinite(count) ? count : ''}`
}

export default function AdhkarItem({
  item,
  showAddButton = false,
  isAdded = false,
  addButtonLabel,
  removeButtonLabel,
  onAdd,
  onRemove
}) {
  const textAr = item?.textAr || item?.text || ''
  const textEn = item?.textEn || ''
  const count = Number(item?.count)

  return (
    <div className={styles['adhkar-item']}>
      <div className={styles['adhkar-content']}>
        <div className={styles['adhkar-row']}>
          {Number.isFinite(count) && <span className={styles['adhkar-count']}>x{count}</span>}
        </div>
        <span className={styles['adhkar-arabic']}>{textAr}</span>
        <span className={styles['adhkar-english']}>{textEn}</span>

        {showAddButton && (
          <button
            type="button"
            className={styles['adhkar-add-btn']}
            onClick={() => {
              const normalized = { ...item, id: item?.id || buildDhikrId(item) }
              if (isAdded) onRemove?.(normalized)
              else onAdd?.(normalized)
            }}
          >
            {isAdded ? (removeButtonLabel || 'Remove from current day') : (addButtonLabel || 'Add to current day')}
          </button>
        )}
      </div>
    </div>
  )
}

