import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']

interface Props {
  byCategory: { name: string; value: number }[]
  trend: { name: string; value: number }[]
  formatAmount: (value: number) => string
}

export function Summary({ byCategory, trend, formatAmount }: Props) {
  const hasData = byCategory.length > 0
  const tooltipFormatter = (value: unknown) => formatAmount(Number(value) || 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-medium text-slate-500">Por categoría</h2>
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                {byCategory.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-16 text-center text-slate-400">Sin datos</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-medium text-slate-500">Evolución</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
            <Tooltip formatter={tooltipFormatter} cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
