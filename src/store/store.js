import { configureStore } from '@reduxjs/toolkit'
import ramadanReducer from './ramadanSlice'

const STORAGE_KEY_DATA = 'ramadanPlannerData'
const STORAGE_KEY_UI = 'ramadanPlannerUI'

function saveToStorage(store) {
  if (typeof window === 'undefined') return

  let lastDataJson = null
  let lastUIJson = null

  store.subscribe(() => {
    const state = store.getState().ramadan

    const dataToSave = {
      importantDates: state.importantDates || {},
      dailyData: state.dailyData || {},
      quranJuz: state.quranJuz || {},
      prayerTracker: state.prayerTracker || {},
      adhkar: state.adhkar || {},
      eidChecklist: state.eidChecklist || {}
    }

    const uiToSave = {
      selectedDay: state.selectedDay
    }

    try {
      const nextDataJson = JSON.stringify(dataToSave)
      if (nextDataJson !== lastDataJson) {
        window.localStorage.setItem(STORAGE_KEY_DATA, nextDataJson)
        lastDataJson = nextDataJson
      }

      const nextUIJson = JSON.stringify(uiToSave)
      if (nextUIJson !== lastUIJson) {
        window.localStorage.setItem(STORAGE_KEY_UI, nextUIJson)
        lastUIJson = nextUIJson
      }
    } catch {
      // ignore storage quota / serialization errors
    }
  })
}

export const store = configureStore({
  reducer: {
    ramadan: ramadanReducer
  }
})

saveToStorage(store)


