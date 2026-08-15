import { useCallback, useEffect, useState } from 'react'
import type { Expense } from '../types'
import { loadExpenses, saveExpenses } from '../lib/storage'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [{ ...expense, id: crypto.randomUUID() }, ...prev])
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const replaceAll = useCallback((next: Expense[]) => {
    setExpenses(next)
  }, [])

  return { expenses, addExpense, removeExpense, replaceAll }
}
