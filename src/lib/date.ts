import type { Period } from '../types'

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function today(): string {
  return toISODate(new Date())
}

/** Lunes como primer día de la semana. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  return d
}

export function startOfPeriod(date: Date, period: Period): Date {
  if (period === 'day') return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (period === 'week') return startOfWeek(date)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfPeriod(date: Date, period: Period): Date {
  const start = startOfPeriod(date, period)
  if (period === 'day') return start
  if (period === 'week') {
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return end
  }
  return new Date(start.getFullYear(), start.getMonth() + 1, 0)
}

export function shiftPeriod(date: Date, period: Period, delta: number): Date {
  const d = startOfPeriod(date, period)
  if (period === 'day') d.setDate(d.getDate() + delta)
  else if (period === 'week') d.setDate(d.getDate() + delta * 7)
  else d.setMonth(d.getMonth() + delta)
  return d
}

export function isInPeriod(iso: string, reference: Date, period: Period): boolean {
  const value = parseISODate(iso).getTime()
  return (
    value >= startOfPeriod(reference, period).getTime() &&
    value <= endOfPeriod(reference, period).getTime()
  )
}

const dayFmt = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' })
const shortFmt = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })
const monthFmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })

export function formatPeriodLabel(date: Date, period: Period): string {
  if (period === 'day') return dayFmt.format(startOfPeriod(date, period))
  if (period === 'week') {
    return `${shortFmt.format(startOfPeriod(date, 'week'))} – ${shortFmt.format(endOfPeriod(date, 'week'))}`
  }
  return monthFmt.format(startOfPeriod(date, 'month'))
}

export function formatShort(iso: string): string {
  return shortFmt.format(parseISODate(iso))
}
