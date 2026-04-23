'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { WeeklyAOV } from '@/lib/supabase'

type Props = { data: WeeklyAOV[] }

const WAREHOUSES = ['NBOF1 - TIMAURD', 'NBOF3 - SAFARI']
const COLORS = { 'NBOF1 - TIMAURD': '#818cf8', 'NBOF3 - SAFARI': '#34d399' }
const LABELS = { 'NBOF1 - TIMAURD': 'TIMAURD', 'NBOF3 - SAFARI': 'SAFARI' }

const KEY_EVENTS: Record<string, string> = {
  '2025-09-15': 'Sep Spike',
  '2025-11-17': 'Pre-Xmas',
  '2025-12-22': 'Xmas Peak',
  '2026-03-30': 'Paycheck',
  '2026-04-13': 'Easter',
}

export default function AOVTrendChart({ data }: Props) {
  const weeks = [...new Set(data.map(d => d.week))].sort()

  const chartData = weeks.map(w => {
    const row: Record<string, string | number> = { week: w.slice(0, 10) }
    WAREHOUSES.forEach(wh => {
      const found = data.find(d => d.week === w && d.warehouse === wh)
      if (found) row[LABELS[wh as keyof typeof LABELS]] = found.aov
    })
    return row
  })

  const fmtWeek = (w: string) => {
    const d = new Date(w)
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const event = KEY_EVENTS[label]
    return (
      <div className="rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm shadow-lg">
        <p className="font-semibold text-slate-200">{fmtWeek(label)}</p>
        {event && <p className="text-amber-400 text-xs mb-1">📌 {event}</p>}
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value?.toLocaleString()} KES</strong>
          </p>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 8, right: 20, left: 10, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="week"
          tickFormatter={fmtWeek}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          interval={3}
          stroke="#334155"
        />
        <YAxis
          tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          stroke="#334155"
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(v) => <span className="text-slate-300 text-sm">{v}</span>}
        />
        {Object.entries(KEY_EVENTS).map(([w, label]) => (
          <ReferenceLine key={w} x={w} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
        ))}
        {WAREHOUSES.map(wh => (
          <Line
            key={wh}
            type="monotone"
            dataKey={LABELS[wh as keyof typeof LABELS]}
            stroke={COLORS[wh as keyof typeof COLORS]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
