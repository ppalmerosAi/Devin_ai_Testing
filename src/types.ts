export type Category =
  | 'Comida'
  | 'Transporte'
  | 'Hogar'
  | 'Salud'
  | 'Ocio'
  | 'Compras'
  | 'Servicios'
  | 'Otros'

export const CATEGORIES: Category[] = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Compras',
  'Servicios',
  'Otros',
]

export interface Expense {
  id: string
  /** Fecha en formato ISO local YYYY-MM-DD */
  date: string
  amount: number
  category: Category
  note: string
}

export type Period = 'day' | 'week' | 'month'
