'use client'

import { useState } from 'react'
import type { SpikeEvent } from '@/lib/supabase'

type Props = { data: SpikeEvent[] }

export default function SpikeEventsTable({ data }: Props) {
  const [warehouse, setWarehouse] = useState('NBOF1 - TIMAURD')

  const topSpikes = data
    .filter(d => d.warehouse === warehouse && d.aov_change_pct !== null)
    .sort((a, b) => b.aov_change_pct - a.aov_change_pct)
    .slice(0, 8)

  const warehouses = [...new Set(data.map(d => d.warehouse))]

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {warehouses.map(wh => (
          <button
            key={wh}
            onClick={() => setWarehouse(wh)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              warehouse === wh
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {wh.includes('TIMAURD') ? 'TIMAURD' : 'SAFARI'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 pr-4 text-slate-400 font-medium">Week</th>
              <th className="text-right py-2 pr-4 text-slate-400 font-medium">AOV</th>
              <th className="text-right py-2 pr-4 text-slate-400 font-medium">WoW</th>
              <th className="text-right py-2 pr-4 text-slate-400 font-medium">Orders</th>
              <th className="text-left py-2 text-slate-400 font-medium">Top Gainer</th>
            </tr>
          </thead>
          <tbody>
            {topSpikes.map((row) => {
              let gainers: Array<{ product: string; cat1: string; delta: number }> = []
              try { gainers = JSON.parse(row.top_gainers || '[]') } catch { gainers = [] }
              const top = gainers[0]
              return (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 pr-4 text-slate-300">{row.week}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-slate-200">
                    {row.aov?.toLocaleString()} KES
                  </td>
                  <td className={`py-2.5 pr-4 text-right font-medium ${row.aov_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.aov_change_pct >= 0 ? '+' : ''}{row.aov_change_pct?.toFixed(1)}%
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-400">{row.orders?.toLocaleString()}</td>
                  <td className="py-2.5 text-slate-300 text-xs">
                    {top ? (
                      <span>
                        <span className="text-emerald-400">+{(top.delta / 1000).toFixed(0)}K</span>
                        {' '}{top.product?.slice(0, 30)}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
