import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentDay,
  selectImportantDates,
  selectQuranJuz,
  setCurrentDay,
  setSelectedDay,
  updateSection
} from '../store/ramadanSlice'
import { getRamadanProgress } from '../utils/ramadanDates'
import '../App.css'
import styles from './AppLayout.module.css'
import QuranCompletionModal from '../components/QuranCompletionModal/QuranCompletionModal'

function AppLayout() {
  const dispatch = useDispatch()
  const currentDay = useSelector(selectCurrentDay)
  const importantDates = useSelector(selectImportantDates)
  const quranJuz = useSelector(selectQuranJuz)
  const cx = (...classes) => classes.filter(Boolean).join(' ')
  const QURAN_COMPLETION_MODAL_SHOWN_KEY = 'ramadanPlannerQuranCompletionModalShown'

  const tabs = useMemo(
    () => [
      { id: 'calendar', label: 'Calendar', icon: '📅', to: '/calendar' },
      { id: 'daily', label: 'Daily Tracker', icon: '📝', to: '/daily' },
      { id: 'quran', label: 'Quran Tracker', icon: '📖', to: '/quran' },
      { id: 'prayer', label: 'Prayer Tracker', icon: '🕌', to: '/prayer' },
      { id: 'adhkar', label: 'Adhkar', icon: '✨', to: '/adhkar' },
      { id: 'eid', label: 'Eid Prep', icon: '🎉', to: '/eid' }
    ],
    []
  )

  // Calculate current day of Ramadan (1-30)
  useEffect(() => {
    const today = new Date()
    const { diffDays, currentDay: computedCurrentDay } = getRamadanProgress(importantDates?.ramadanStart, today)

    // Keep currentDay predictable even before/after Ramadan
    dispatch(setCurrentDay(computedCurrentDay))

    // Only auto-sync selected day on first run, and only when within Ramadan days
    if (diffDays >= 1 && diffDays <= 30) {
      try {
        const uiRaw = window.localStorage.getItem('ramadanPlannerUI')
        if (!uiRaw) dispatch(setSelectedDay(diffDays))
      } catch {
        // ignore
      }
    }
  }, [dispatch, importantDates?.ramadanStart])

  const completedJuz = Object.values(quranJuz || {}).filter(Boolean).length
  const allQuranCompleted = completedJuz === 30
  const [quranCompletionModalShown, setQuranCompletionModalShown] = useState(() => {
    try {
      return window.localStorage.getItem(QURAN_COMPLETION_MODAL_SHOWN_KEY) === '1'
    } catch {
      return false
    }
  })
  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false)

  useEffect(() => {
    // Reset "shown" only when user becomes incomplete again (unchecks one or more).
    // This enables the modal to show again only after re-completing.
    if (!allQuranCompleted) {
      setIsQuranModalOpen(false)
      setQuranCompletionModalShown(false)
      try {
        window.localStorage.removeItem(QURAN_COMPLETION_MODAL_SHOWN_KEY)
      } catch {
        // ignore
      }
      return
    }

    // If Quran just reached 30/30 and we haven't shown the modal for this completion cycle, show it once.
    if (allQuranCompleted && !quranCompletionModalShown) {
      setIsQuranModalOpen(true)
      setQuranCompletionModalShown(true)
      try {
        window.localStorage.setItem(QURAN_COMPLETION_MODAL_SHOWN_KEY, '1')
      } catch {
        // ignore
      }
    }
  }, [allQuranCompleted, quranCompletionModalShown])

  return (
    <div className={styles.app}>
      <QuranCompletionModal
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
      />
      <header className={styles['app-header']}>
        <div className={styles['header-content']}>
          <h1>Your Ramadan Planner 2026</h1>
          <p className={styles.subtitle}>You can track your daily activities here · </p>
          <div className={styles['day-indicator']}>
            <span>Day {currentDay} of 30</span>
          </div>

          <div className={styles['date-controls']}>
            <label className={styles['date-label']}>
              Ramadan start:
              <input
                className={styles['date-input']}
                type="date"
                value={importantDates?.ramadanStart || ''}
                onChange={(e) => dispatch(updateSection({ section: 'importantDates', data: { ramadanStart: e.target.value } }))}
              />
            </label>
          </div>
        </div>
      </header>

      <nav className={styles['main-nav']}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.to}
            className={({ isActive }) => cx(styles['nav-tab'], isActive && styles.active)}
          >
            <span className={styles['tab-icon']}>{tab.icon}</span>
            <span className={styles['tab-label']}>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles['app-container']}>
        <Outlet />
      </div>

      <div className={styles['app-footer']}>
        <p>Designed and Developed by <a href="https://www.ahmedelashry.com/" target="_blank" rel="noopener noreferrer">Ahmed Elashry</a></p>
      </div>
    </div>
  )
}

export default AppLayout


