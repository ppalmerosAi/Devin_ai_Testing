import { useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type Expense } from '../types'
import { today } from '../lib/date'

interface Props {
  onAdd: (expense: Omit<Expense, 'id'>) => void
}

export function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today())
  const [category, setCategory] = useState<Category>('Comida')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) {
      setError('Introduce un importe mayor que 0')
      return
    }
    onAdd({ amount: Math.round(value * 100) / 100, date, category, note: note.trim() })
    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] sm:items-end"
    >
      <label className="grid gap-1 text-sm text-slate-600">
        Importe
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0,00"
          aria-label="Importe"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-600">
        Fecha
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Fecha"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-600">
        Categoría
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          aria-label="Categoría"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm text-slate-600">
        Nota
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opcional"
          aria-label="Nota"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
        />
      </label>

      <button
        type="submit"
        className="h-[42px] rounded-lg bg-slate-900 px-5 font-medium text-white transition hover:bg-slate-700"
      >
        Añadir
      </button>

      {error && <p className="text-sm text-red-600 sm:col-span-5">{error}</p>}
    </form>
  )
}
