import { Navigate } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import CalendarGrid from './components/CalendarGrid/CalendarGrid'
import DailyTracker from './components/DailyTracker/DailyTracker'
import QuranTracker from './components/QuranTracker/QuranTracker'
import PrayerTracker from './components/PryerTracker/PrayerTracker'
import Adhkar from './components/Adhkar/Adhkar'
import EidChecklist from './components/EidCheclist/EidChecklist'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/daily" replace /> },
      { path: '/calendar', element: <CalendarGrid /> },
      { path: '/daily', element: <DailyTracker /> },
      { path: '/quran', element: <QuranTracker /> },
      { path: '/prayer', element: <PrayerTracker /> },
      { path: '/adhkar', element: <Adhkar /> },
      { path: '/eid', element: <EidChecklist /> },
      { path: '*', element: <Navigate to="/daily" replace /> }
    ]
  }
])


