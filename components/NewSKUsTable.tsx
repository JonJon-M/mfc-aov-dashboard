'use client'

import type { NewSKU } from '@/lib/supabase'

type Props = { data: NewSKU[] }

export default function NewSKUsTable({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue)
  const total = sorted.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 pr-3 text-slate-400 font-medium">#</th>
            <th className="text-left py-2 pr-3 text-slate-400 font-medium">New SKU (Jan 2026+)</th>
            <th className="text-left py-2 pr-3 text-slate-400 font-medium">Category</th>
            <th className="text-right py-2 text-slate-400 font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
              <td className="py-2 pr-3 text-slate-500 text-xs">{i + 1}</td>
              <td className="py-2 pr-3 text-slate-200 max-w-[220px] truncate">{row.product}</td>
              <td className="py-2 pr-3">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  row.category === 'Bws' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {row.category?.slice(0, 18)}
                </span>
              </td>
              <td className="py-2 text-right">
                <span className="font-mono text-slate-200">{(row.revenue / 1000).toFixed(0)}K</span>
                <span className="text-slate-500 text-xs ml-1">({(row.revenue / total * 100).toFixed(1)}%)</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-2">
        New SKUs total: {(total / 1_000_000).toFixed(2)}M KES · TIMAURD only
      </p>
    </div>
  )
}
