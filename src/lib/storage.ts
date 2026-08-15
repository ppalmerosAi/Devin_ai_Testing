import { CATEGORIES, type Expense } from '../types'

const STORAGE_KEY = 'gastos:v1'
const CURRENCY_KEY = 'gastos:currency'

function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const e = value as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.date === 'string' &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    typeof e.category === 'string' &&
    CATEGORIES.includes(e.category as Expense['category']) &&
    typeof e.note === 'string'
  )
}

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isExpense)
  } catch {
    return []
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export function loadCurrency(): string {
  return localStorage.getItem(CURRENCY_KEY) ?? 'EUR'
}

export function saveCurrency(currency: string): void {
  localStorage.setItem(CURRENCY_KEY, currency)
}

export function parseImported(raw: string): Expense[] {
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista de gastos')
  const valid = parsed.filter(isExpense)
  if (valid.length === 0) throw new Error('No se encontraron gastos válidos en el archivo')
  return valid
}

export function toCSV(expenses: Expense[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const rows = expenses.map((e) =>
    [e.date, e.amount.toFixed(2), e.category, escape(e.note)].join(','),
  )
  return ['fecha,importe,categoria,nota', ...rows].join('\n')
}
