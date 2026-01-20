import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './QuranCompletionModal.module.css'

export default function QuranCompletionModal({ isOpen, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      // Only call showModal() if not already open
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  const Modal = (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Quran completion congratulations"
      onCancel={(e) => {
        // prevent the browser default close, so we control state
        e.preventDefault()
        onClose?.()
      }}
      onClick={(e) => {
        // clicking the backdrop triggers a click on the <dialog>
        if (e.target === dialogRef.current) onClose?.()
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Masha’Allah — Completed!</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.badge}>🎉 30 / 30 Juz`s</div>
          <p className={styles.message}>
            Congratulations! You’ve completed reading the entire Qur’an. May Allah accept it from you and bless you with
            steadfastness.
          </p>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              Alhamdulillah
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )

  return createPortal(Modal, document.body)
}

