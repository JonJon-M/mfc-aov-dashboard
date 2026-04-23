'use client'

type Props = {
  title: string
  value: string
  sub?: string
  change?: number
  icon?: string
  color?: string
}

export default function MetricCard({ title, value, sub, change, icon, color = 'indigo' }: Props) {
  const colors: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/30',
    sky: 'from-sky-500/20 to-sky-600/5 border-sky-500/30',
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/30',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {change !== undefined && (
          <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  )
}
