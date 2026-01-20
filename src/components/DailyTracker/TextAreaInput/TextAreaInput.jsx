import { useEffect, useMemo, useState } from 'react'
import styles from './TextAreaInput.module.css'

function normalizeEntries(value, legacyKey) {
  // New shape: [{ id, text, createdAt }]
  if (Array.isArray(value)) {
    return value
      .map((x, idx) => {
        if (typeof x === 'string') {
          const text = x.trim()
          if (!text) return null
          return { id: `legacy-${legacyKey}-${idx}`, text, createdAt: Date.now() }
        }

        if (!x || typeof x !== 'object') return null
        const text = String(x.text ?? x.value ?? '').trim()
        if (!text) return null

        const createdAt = Number.isFinite(Number(x.createdAt)) ? Number(x.createdAt) : Date.now()
        const id =
          x.id != null && String(x.id).trim()
            ? String(x.id)
            : `${legacyKey}-${createdAt}-${idx}-${Math.random().toString(16).slice(2)}`

        return { id, text, createdAt }
      })
      .filter(Boolean)
  }

  // Backward compat: old shape was a single string
  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return []
    return [{ id: `legacy-${legacyKey}`, text, createdAt: Date.now() }]
  }

  return []
}

function makeId() {
  try {
    if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID()
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function TextAreaInput({
  title,
  placeholder,
  rows = 3,
  value,
  onUpdate,
  wrapperClassName,
  resetKey,
  savedLabel,
  after
}) {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setDraft('')
  }, [resetKey])

  const legacyKey = useMemo(() => {
    const key = String(title || 'field')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return key || 'field'
  }, [title])

  const entries = useMemo(() => {
    return normalizeEntries(value, legacyKey).sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
  }, [value, legacyKey])

  const effectiveSavedLabel = savedLabel || `Your Saved ${String(title || '').toLowerCase()}`

  const handleSave = () => {
    const text = String(draft || '').trim()
    if (!text) return
    const next = [...entries, { id: makeId(), text, createdAt: Date.now() }]
    onUpdate?.(next)
    setDraft('')
  }

  const handleDelete = (id) => {
    const next = entries.filter((x) => String(x.id) !== String(id))
    onUpdate?.(next)
  }

  return (
    <div className={wrapperClassName}>
      <h3>{title}</h3>
      <textarea placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} rows={rows} />

      <div className={styles.actions}>
        <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={!String(draft).trim()}>
          Save
        </button>
      </div>

      {entries.length > 0 && (
        <div className={styles.savedList}>
          <div className={styles.savedLabel}>{effectiveSavedLabel}</div>
          <div className={styles.savedItems}>
            {entries.map((entry) => (
              <div key={entry.id} className={styles.savedItem}>
                <div className={styles.savedItemText}>{entry.text}</div>
                <div className={styles.savedItemActions}>
                  <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(entry.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {after}
    </div>
  )
}

