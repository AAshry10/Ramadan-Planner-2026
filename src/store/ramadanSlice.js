import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY_DATA = 'ramadanPlannerData'
const STORAGE_KEY_UI = 'ramadanPlannerUI'

const defaultData = {
  importantDates: {},
  dailyData: {},
  quranJuz: {},
  prayerTracker: {},
  adhkar: {},
  eidChecklist: {}
}

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function loadDataFromStorage() {
  if (typeof window === 'undefined') return defaultData
  const raw = window.localStorage.getItem(STORAGE_KEY_DATA)
  if (!raw) return defaultData
  const parsed = safeParse(raw)
  if (!parsed || typeof parsed !== 'object') return defaultData
  // Only keep supported keys (drop removed sections like goals/intentions/reflection).
  const sanitized = {}
  for (const key of Object.keys(defaultData)) {
    const v = parsed[key]
    sanitized[key] = v && typeof v === 'object' ? v : defaultData[key]
  }
  return { ...defaultData, ...sanitized }
}

function loadUIFromStorage() {
  if (typeof window === 'undefined') return { selectedDay: 1, hasSavedSelectedDay: false }
  const raw = window.localStorage.getItem(STORAGE_KEY_UI)
  if (!raw) return { selectedDay: 1, hasSavedSelectedDay: false }
  const parsed = safeParse(raw)
  const selectedDay = Number(parsed?.selectedDay)
  if (!Number.isFinite(selectedDay) || selectedDay < 1 || selectedDay > 30) {
    return { selectedDay: 1, hasSavedSelectedDay: false }
  }
  return { selectedDay, hasSavedSelectedDay: true }
}

const initialData = loadDataFromStorage()
const initialUI = loadUIFromStorage()

const ramadanSlice = createSlice({
  name: 'ramadan',
  initialState: {
    currentDay: 1,
    selectedDay: initialUI.selectedDay,
    hasSavedSelectedDay: initialUI.hasSavedSelectedDay,
    ...initialData
  },
  reducers: {
    setCurrentDay(state, action) {
      const day = Number(action.payload)
      // Allow 0 to represent "before Ramadan starts"
      if (!Number.isFinite(day) || day < 0 || day > 30) return
      state.currentDay = day
    },
    setSelectedDay(state, action) {
      const day = Number(action.payload)
      if (!Number.isFinite(day) || day < 1 || day > 30) return
      state.selectedDay = day
      state.hasSavedSelectedDay = true
    },
    updateSection(state, action) {
      const { section, data } = action.payload || {}
      if (!section || typeof section !== 'string') return
      if (!data || typeof data !== 'object') return
      state[section] = { ...(state[section] || {}), ...data }
    },
    updateDailyData(state, action) {
      const { day, data } = action.payload || {}
      const dayNum = Number(day)
      if (!Number.isFinite(dayNum) || dayNum < 1 || dayNum > 30) return
      if (!data || typeof data !== 'object') return

      state.dailyData = state.dailyData || {}
      const prevDay = state.dailyData[dayNum] || {}
      state.dailyData[dayNum] = { ...prevDay, ...data }
    }
  }
})

export const {
  setCurrentDay,
  setSelectedDay,
  updateSection,
  updateDailyData
} = ramadanSlice.actions

export const selectCurrentDay = (state) => state.ramadan.currentDay
export const selectSelectedDay = (state) => state.ramadan.selectedDay

export const selectImportantDates = (state) => state.ramadan.importantDates || {}

export const selectDailyDataMap = (state) => state.ramadan.dailyData || {}
export const selectDayData = (state, day) => {
  const map = state.ramadan.dailyData || {}
  return map[day]
}

export const selectQuranJuz = (state) => state.ramadan.quranJuz || {}
export const selectPrayerTracker = (state) => state.ramadan.prayerTracker || {}
export const selectAdhkar = (state) => state.ramadan.adhkar || {}
export const selectEidChecklist = (state) => state.ramadan.eidChecklist || {}

export default ramadanSlice.reducer


