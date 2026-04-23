'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import type { PaycheckPattern } from '@/lib/supabase'

type Props = { data: PaycheckPattern[] }

const PERIOD_ORDER = ['W1 (1-7)', 'W2 (8-14)', 'W3 (15-21)', 'W4 (22-31)']

export default function PaycheckChart({ data }: Props) {
  const warehouses = [...new Set(data.map(d => d.warehouse))]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {warehouses.map(wh => {
        const wh_data = PERIOD_ORDER.map(p => {
          const found = data.find(d => d.warehouse === wh && d.period === p)
          return { period: p, aov: found?.avg_aov ?? 0, weeks: found?.sample_weeks ?? 0 }
        })
        const max = Math.max(...wh_data.map(d => d.aov))

        return (
          <div key={wh}>
            <p className="text-sm text-slate-400 mb-3 font-medium">
              {wh.includes('TIMAURD') ? 'TIMAURD' : 'SAFARI'}
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={wh_data} margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#334155" />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  stroke="#334155"
                  tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toLocaleString()} KES`, 'Avg AOV']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Bar dataKey="aov" radius={[4, 4, 0, 0]}>
                  {wh_data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.aov === max ? '#818cf8' : '#334155'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  )
}
