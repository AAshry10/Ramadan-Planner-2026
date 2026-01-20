const MS_PER_DAY = 1000 * 60 * 60 * 24

export function parseDateInput(value) {
  // expects YYYY-MM-DD from <input type="date">
  if (!value || typeof value !== 'string') return null
  const [y, m, d] = value.split('-').map(Number)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null
  const date = new Date(y, m - 1, d) // local time (avoids UTC off-by-one issues)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getRamadanProgress(ramadanStartInput, now = new Date()) {
  const ramadanStartFromUI = parseDateInput(ramadanStartInput)
  // fallback: February 18, 2026 (approximate) - month is 0-based
  const ramadanStart = ramadanStartFromUI || new Date(2026, 2, 18)

  const diffTime = now - ramadanStart
  const diffDays = Math.floor(diffTime / MS_PER_DAY) + 1

  const phase = diffDays < 1 ? 'before' : diffDays > 30 ? 'after' : 'during'
  const currentDay = phase === 'before' ? 0 : phase === 'after' ? 30 : diffDays

  return { ramadanStart, diffDays, phase, currentDay }
}

export function hasRamadanDayPassed(day, ramadanStartInput, now = new Date()) {
  const dayNum = Number(day)
  if (!Number.isFinite(dayNum) || dayNum < 1 || dayNum > 30) return false

  const { diffDays, phase } = getRamadanProgress(ramadanStartInput, now)
  if (phase === 'before') return false
  if (phase === 'after') return true
  // during: current day is diffDays, so only days strictly before it have passed
  return dayNum < diffDays
}

