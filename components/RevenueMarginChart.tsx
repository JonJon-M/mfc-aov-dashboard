'use client'

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { MonthlySummary } from '@/lib/supabase'

type Props = { data: MonthlySummary[]; warehouse: string }

export default function RevenueMarginChart({ data, warehouse }: Props) {
  const filtered = data.filter(d => d.warehouse === warehouse).sort((a, b) => a.month.localeCompare(b.month))

  const chartData = filtered.map(d => ({
    month: d.month.slice(0, 7),
    'Revenue (M KES)': +(d.rev / 1_000_000).toFixed(2),
    'Margin %': +d.margin_pct.toFixed(1),
    'Avg AOV': Math.round(d.avg_aov),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm shadow-lg">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}{p.name.includes('%') ? '%' : p.name.includes('AOV') ? ' KES' : 'M'}</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 24, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155" />
        <YAxis yAxisId="rev" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155"
          tickFormatter={v => `${v}M`} />
        <YAxis yAxisId="pct" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155"
          domain={[20, 30]} tickFormatter={v => `${v}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span className="text-slate-300 text-sm">{v}</span>} />
        <Bar yAxisId="rev" dataKey="Revenue (M KES)" fill="#6366f1" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
        <Line yAxisId="pct" type="monotone" dataKey="Margin %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
