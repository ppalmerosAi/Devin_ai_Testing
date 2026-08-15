import { useMemo, useRef, useState } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Summary } from './components/Summary'
import { useExpenses } from './hooks/useExpenses'
import { useTheme } from './hooks/useTheme'
import {
  formatPeriodLabel,
  isInPeriod,
  parseISODate,
  shiftPeriod,
  startOfPeriod,
} from './lib/date'
import { loadCurrency, parseImported, saveCurrency, toCSV } from './lib/storage'
import type { Period } from './types'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'day', label: 'Diario' },
  { id: 'week', label: 'Semanal' },
  { id: 'month', label: 'Mensual' },
]

const CURRENCIES = ['EUR', 'USD', 'MXN', 'GBP']

const TREND_STEPS: Record<Period, number> = { day: 7, week: 6, month: 6 }

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const { expenses, addExpense, removeExpense, replaceAll } = useExpenses()
  const [period, setPeriod] = useState<Period>('day')
  const [reference, setReference] = useState(() => new Date())
  const [currency, setCurrency] = useState(() => loadCurrency())
  const { theme, toggleTheme } = useTheme()
  const fileInput = useRef<HTMLInputElement>(null)

  const formatAmount = useMemo(() => {
    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency })
    return (value: number) => formatter.format(value)
  }, [currency])

  const visible = useMemo(
    () =>
      expenses
        .filter((e) => isInPeriod(e.date, reference, period))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, reference, period],
  )

  const total = useMemo(() => visible.reduce((sum, e) => sum + e.amount, 0), [visible])

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>()
    for (const e of visible) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount)
    return [...totals.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value)
  }, [visible])

  const trend = useMemo(() => {
    const steps = TREND_STEPS[period]
    return Array.from({ length: steps }, (_, i) => {
      const point = shiftPeriod(reference, period, i - (steps - 1))
      const value = expenses
        .filter((e) => isInPeriod(e.date, point, period))
        .reduce((sum, e) => sum + e.amount, 0)
      return {
        name: formatPeriodLabel(point, period).slice(0, period === 'month' ? 3 : 6),
        value: Math.round(value * 100) / 100,
      }
    })
  }, [expenses, reference, period])

  const isCurrentPeriod =
    startOfPeriod(reference, period).getTime() === startOfPeriod(new Date(), period).getTime()

  function handleImport(file: File) {
    file
      .text()
      .then((raw) => replaceAll(parseImported(raw)))
      .catch((error: unknown) => {
        window.alert(error instanceof Error ? error.message : 'No se pudo importar el archivo')
      })
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Mis gastos</h1>
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value)
                saveCurrency(e.target.value)
              }}
              aria-label="Moneda"
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => download('gastos.json', JSON.stringify(expenses, null, 2), 'application/json')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={() => download('gastos.csv', toCSV(expenses), 'text/csv')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Importar
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImport(file)
                e.target.value = ''
              }}
            />
          </div>
        </header>

        <ExpenseForm onAdd={addExpense} />

        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {PERIODS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPeriod(id)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    period === id
                      ? 'bg-white font-medium shadow-sm dark:bg-slate-700'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Periodo anterior"
                onClick={() => setReference((d) => shiftPeriod(d, period, -1))}
                className="rounded-lg border border-slate-300 px-2.5 py-1 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ‹
              </button>
              <span className="min-w-48 text-center text-sm text-slate-600 dark:text-slate-300">
                {formatPeriodLabel(reference, period)}
              </span>
              <button
                type="button"
                aria-label="Periodo siguiente"
                disabled={isCurrentPeriod}
                onClick={() => setReference((d) => shiftPeriod(d, period, 1))}
                className="rounded-lg border border-slate-300 px-2.5 py-1 transition hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tabular-nums">{formatAmount(total)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {visible.length} {visible.length === 1 ? 'gasto' : 'gastos'}
            </span>
          </div>
        </section>

        <Summary byCategory={byCategory} trend={trend} formatAmount={formatAmount} theme={theme} />

        <ExpenseList expenses={visible} formatAmount={formatAmount} onRemove={removeExpense} />

        <footer className="pb-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Los datos se guardan sólo en este navegador (localStorage).
          {expenses.length > 0 &&
            ` Primer registro: ${parseISODate(
              expenses.reduce((min, e) => (e.date < min ? e.date : min), expenses[0].date),
            ).toLocaleDateString('es-ES')}`}
        </footer>
      </div>
    </div>
  )
}
