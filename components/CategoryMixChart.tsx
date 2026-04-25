'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import type { CategoryMix } from '@/lib/supabase'

type Props = { data: CategoryMix[]; warehouse: string }

const CATEGORY_COLORS: Record<string, string> = {
  'Bws': '#818cf8',
  'Beverages': '#38bdf8',
  'Dairy / Chilled / Eggs': '#34d399',
  'Packaged Foods': '#fb923c',
  'Snacks': '#f472b6',
  'Produce': '#a3e635',
  'Meat / Seafood': '#f87171',
  'Home / Pet': '#fbbf24',
  'Personal Care / Baby / Health': '#c084fc',
  'Smoking / Tobacco': '#94a3b8',
  'Frozen': '#67e8f9',
  'Ready To Consume': '#fdba74',
  'Bread / Bakery': '#d4d4aa',
  'General Merchandise': '#7dd3fc',
}

export default function CategoryMixChart({ data, warehouse }: Props) {
  const filtered = data.filter(d => d.warehouse === warehouse)
  const months = [...new Set(filtered.map(d => d.month))].sort()
  const TOP_N = 8
  const allCategories = [...new Set(filtered.map(d => d.category))]
    .sort((a, b) => {
      const aSum = filtered.filter(d => d.category === a).reduce((s, d) => s + d.share, 0)
      const bSum = filtered.filter(d => d.category === b).reduce((s, d) => s + d.share, 0)
      return bSum - aSum
    })
  const categories = allCategories.slice(0, TOP_N)
  const otherCategories = allCategories.slice(TOP_N)

  const chartData = months.map(m => {
    const row: Record<string, string | number> = { month: m }
    let top8Sum = 0
    categories.forEach(cat => {
      const found = filtered.find(d => d.month === m && d.category === cat)
      const val = found ? found.share : 0
      row[cat] = val
      top8Sum += val
    })
    if (otherCategories.length > 0) {
      row['Other'] = Math.max(0, +(100 - top8Sum).toFixed(2))
    }
    return row
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-xs shadow-lg max-w-48">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {[...payload].reverse().map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name.slice(0, 24)}: <strong>{(+p.value).toFixed(1)}%</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155" />
        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155" tickFormatter={v => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span className="text-slate-300 text-xs">{v}</span>} />
        {categories.map(cat => (
          <Bar key={cat} dataKey={cat} stackId="a"
            fill={CATEGORY_COLORS[cat] || '#64748b'} />
        ))}
        {otherCategories.length > 0 && (
          <Bar key="Other" dataKey="Other" stackId="a" fill="#475569" />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
