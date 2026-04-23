'use client'

import { useState } from 'react'
import type { TopSKU } from '@/lib/supabase'

type Props = { data: TopSKU[] }

export default function TopSKUsTable({ data }: Props) {
  const [warehouse, setWarehouse] = useState('NBOF1 - TIMAURD')

  const filtered = data
    .filter(d => d.warehouse === warehouse)
    .sort((a, b) => b.total_rev - a.total_rev)
    .slice(0, 15)

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
              <th className="text-left py-2 pr-3 text-slate-400 font-medium">#</th>
              <th className="text-left py-2 pr-3 text-slate-400 font-medium">Product</th>
              <th className="text-left py-2 pr-3 text-slate-400 font-medium">Category</th>
              <th className="text-right py-2 pr-3 text-slate-400 font-medium">Revenue</th>
              <th className="text-right py-2 pr-3 text-slate-400 font-medium">Share</th>
              <th className="text-right py-2 text-slate-400 font-medium">Wks</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="py-2 pr-3 text-slate-500 text-xs">{i + 1}</td>
                <td className="py-2 pr-3 text-slate-200 max-w-[200px] truncate">{row.product}</td>
                <td className="py-2 pr-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
                    {row.cat1?.slice(0, 12)}
                  </span>
                </td>
                <td className="py-2 pr-3 text-right font-mono text-slate-200">
                  {(row.total_rev / 1000).toFixed(0)}K
                </td>
                <td className="py-2 pr-3 text-right text-indigo-400 font-medium">{row.share?.toFixed(2)}%</td>
                <td className="py-2 text-right text-slate-400">{row.weeks_active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
