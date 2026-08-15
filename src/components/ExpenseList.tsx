import type { Expense } from '../types'
import { formatShort } from '../lib/date'

interface Props {
  expenses: Expense[]
  formatAmount: (value: number) => string
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, formatAmount, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Sin gastos en este periodo.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-900">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
          <span className="w-16 shrink-0 text-sm text-slate-500 dark:text-slate-400">
            {formatShort(expense.date)}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {expense.category}
          </span>
          <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">
            {expense.note}
          </span>
          <span className="font-medium text-slate-900 tabular-nums dark:text-slate-100">
            {formatAmount(expense.amount)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(expense.id)}
            aria-label={`Eliminar gasto de ${formatAmount(expense.amount)}`}
            className="rounded-md px-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
