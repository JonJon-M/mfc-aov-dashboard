'use client'

import { useEffect, useState } from 'react'
import type {
  WeeklyAOV, MonthlySummary, CategoryMix,
  TopSKU, SpikeEvent, PaycheckPattern, NewSKU
} from '@/lib/supabase'
import AOVTrendChart from '@/components/AOVTrendChart'
import RevenueMarginChart from '@/components/RevenueMarginChart'
import CategoryMixChart from '@/components/CategoryMixChart'
import TopSKUsTable from '@/components/TopSKUsTable'
import SpikeEventsTable from '@/components/SpikeEventsTable'
import PaycheckChart from '@/components/PaycheckChart'
import NewSKUsTable from '@/components/NewSKUsTable'
import MetricCard from '@/components/MetricCard'

type DashboardData = {
  weeklyAov: WeeklyAOV[]
  monthly: MonthlySummary[]
  catMix: CategoryMix[]
  topSkus: TopSKU[]
  spikes: SpikeEvent[]
  paycheck: PaycheckPattern[]
  newSkus: NewSKU[]
}

function summaryStats(weeklyAov: WeeklyAOV[], monthly: MonthlySummary[]) {
  const timaurd = weeklyAov.filter(d => d.warehouse === 'NBOF1 - TIMAURD').sort((a, b) => a.week.localeCompare(b.week))
  const safari  = weeklyAov.filter(d => d.warehouse === 'NBOF3 - SAFARI').sort((a, b) => a.week.localeCompare(b.week))
  const latestT = timaurd[timaurd.length - 2]
  const latestS = safari[safari.length - 2]
  const baseT   = timaurd[0]
  const peakT   = timaurd.reduce((m, d) => (d.aov > m.aov ? d : m), timaurd[0] ?? { aov: 0, week: '' })
  const totalRev = monthly.reduce((s, d) => s + (d.rev ?? 0), 0)
  const avgMargin = monthly.filter(d => d.warehouse === 'NBOF1 - TIMAURD')
    .reduce((s, d, _, a) => s + d.margin_pct / a.length, 0)
  return { latestT, latestS, baseT, peakT, totalRev, avgMargin }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [weeklyAov, monthly, catMix, topSkus, spikes, paycheck, newSkus] = await Promise.all([
          fetch('/data/weekly_aov.json').then(r => r.json()),
          fetch('/data/monthly_summary.json').then(r => r.json()),
          fetch('/data/category_mix.json').then(r => r.json()),
          fetch('/data/top_skus.json').then(r => r.json()),
          fetch('/data/spike_events.json').then(r => r.json()),
          fetch('/data/paycheck_pattern.json').then(r => r.json()),
          fetch('/data/new_skus_2026.json').then(r => r.json()),
        ])
        setData({ weeklyAov, monthly, catMix, topSkus, spikes, paycheck, newSkus })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading dashboard data…</p>
        </div>
      </div>
    )
  }

  const { weeklyAov, monthly, catMix, topSkus, spikes, paycheck, newSkus } = data
  const { latestT, latestS, baseT, peakT, totalRev, avgMargin } = summaryStats(weeklyAov, monthly)
  const aovGrowthT = baseT ? ((latestT?.aov - baseT.aov) / baseT.aov * 100) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">M</div>
            <div>
              <h1 className="text-base font-semibold text-slate-100">MFC AOV Dashboard</h1>
              <p className="text-xs text-slate-500">TIMAURD · SAFARI — Apr 2025 to Apr 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live via Supabase
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-8 space-y-10">

        {/* KPI Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="TIMAURD Current AOV"
            value={`${latestT?.aov?.toLocaleString(undefined, { maximumFractionDigits: 0 })} KES`}
            change={latestT?.aov_change_pct ?? undefined}
            sub="vs prior week"
            icon="🏪"
            color="indigo"
          />
          <MetricCard
            title="SAFARI Current AOV"
            value={`${latestS?.aov?.toLocaleString(undefined, { maximumFractionDigits: 0 })} KES`}
            change={latestS?.aov_change_pct ?? undefined}
            sub="vs prior week"
            icon="🦁"
            color="emerald"
          />
          <MetricCard
            title="Peak AOV (all time)"
            value={`${peakT?.aov?.toLocaleString(undefined, { maximumFractionDigits: 0 })} KES`}
            sub={peakT?.week ?? ''}
            icon="🏆"
            color="amber"
          />
          <MetricCard
            title="AOV Growth (52 wks)"
            value={`+${aovGrowthT.toFixed(1)}%`}
            sub="May 2025 → Apr 2026"
            icon="📈"
            color="sky"
          />
          <MetricCard
            title="Total Revenue"
            value={`${(totalRev / 1_000_000).toFixed(0)}M KES`}
            sub="Combined warehouses"
            icon="💰"
            color="violet"
          />
          <MetricCard
            title="Blended Margin"
            value={`${avgMargin.toFixed(1)}%`}
            sub="TIMAURD avg gross margin"
            icon="📊"
            color="rose"
          />
        </section>

        {/* AOV Trend */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-100">Weekly AOV Trend</h2>
            <p className="text-xs text-slate-500 mt-1">
              True average basket value (net of VAT) · Dashed lines mark key events
            </p>
          </div>
          <AOVTrendChart data={weeklyAov} />
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 border-t border-slate-800 pt-3">
            {[
              'Sep 15 2025 — Back-to-school ultra-premium BWS spike (SAFARI +36%)',
              'Nov 17 2025 — Pre-Christmas wine & spirits ramp begins',
              'Dec 22 2025 — Christmas peak: JW Icon LE, White Cap, Baileys',
              'Apr 13 2026 — Easter week (Good Friday Apr 18)',
            ].map(e => (
              <span key={e} className="text-amber-500/80">⸻ {e}</span>
            ))}
          </div>
        </section>

        {/* Revenue + Margin Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['NBOF1 - TIMAURD', 'NBOF3 - SAFARI'] as const).map(wh => (
            <div key={wh} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-100">
                  {wh.includes('TIMAURD') ? 'TIMAURD' : 'SAFARI'} — Monthly Revenue & Margin
                </h2>
                <p className="text-xs text-slate-500 mt-1">Bars = revenue (M KES) · Line = gross margin %</p>
              </div>
              <RevenueMarginChart data={monthly} warehouse={wh} />
            </div>
          ))}
        </section>

        {/* Category Mix */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['NBOF1 - TIMAURD', 'NBOF3 - SAFARI'] as const).map(wh => (
            <div key={wh} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-100">
                  {wh.includes('TIMAURD') ? 'TIMAURD' : 'SAFARI'} — Category Revenue Mix
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  BWS dominates: {wh.includes('TIMAURD') ? '35–44%' : '47–54%'} of revenue
                </p>
              </div>
              <CategoryMixChart data={catMix} warehouse={wh} />
            </div>
          ))}
        </section>

        {/* Spike Events + Top SKUs */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-100">Top AOV Spike Weeks</h2>
              <p className="text-xs text-slate-500 mt-1">Biggest week-on-week AOV jumps with top gainer SKU</p>
            </div>
            <SpikeEventsTable data={spikes} />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-100">Top Revenue SKUs — Full Year</h2>
              <p className="text-xs text-slate-500 mt-1">Top 15 by total revenue · Top 20 = 11–14% of total</p>
            </div>
            <TopSKUsTable data={topSkus} />
          </div>
        </section>

        {/* Paycheck Pattern */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-100">Paycheck Pattern — AOV by Week-in-Month</h2>
            <p className="text-xs text-slate-500 mt-1">
              W4 (22nd–31st) is consistently highest · End-of-month salary run drives +2.5–4% AOV lift
            </p>
          </div>
          <PaycheckChart data={paycheck} />
        </section>

        {/* New SKUs + Commercial Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-100">New SKUs — Jan 2026 Onwards (TIMAURD)</h2>
              <p className="text-xs text-slate-500 mt-1">
                1,293 new entrants · 9.4% of recent revenue · BWS premiumisation is the clear signal
              </p>
            </div>
            <NewSKUsTable data={newSkus} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-100">Commercial Insights</h2>
              <p className="text-xs text-slate-500 mt-1">Key findings from the 52-week analysis</p>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { icon: '🏆', title: 'Christmas is the AOV peak', body: 'Dec 2025: TIMAURD 1,997 KES (+42% vs May baseline). JW Black Icon LE, Baileys, and White Cap drove the surge. Pre-position premium spirits from Nov 10.' },
                { icon: '💸', title: 'Zero formal promotions — untapped lever', body: '0.04% of revenue came from discounts across 52 weeks. A single threshold mechanic (e.g. 10% off over 3,000 KES) could test AOV elasticity at minimal cost.' },
                { icon: '🌀', title: 'Jinro Soju is the volatility driver', body: '4 flavours, ~3.3M KES since Jan 2026 but ±100–200K weekly swings. Carry all flavours simultaneously to prevent rotation-driven revenue losses.' },
                { icon: '📅', title: 'October is SAFARI\'s weak month', body: 'SAFARI AOV hit 1,218 KES in Oct vs TIMAURD 1,481 (21% gap). Kenyatta + Moi Day holidays suppress SAFARI disproportionately. Targeted retention offer needed.' },
                { icon: '🐣', title: 'Easter underdelivered in 2026', body: 'Apr 13 AOV fell -0.7% despite Good Friday Apr 18. Pre-order campaign pushed Tuesday of Holy Week would shift purchasing earlier into the metric window.' },
                { icon: '🥃', title: 'BWS is the structural AOV engine', body: 'SAFARI at 50–53% BWS vs TIMAURD 35–38%. Every major AOV spike is driven by premium spirits. Growing BWS share is the primary commercial lever.' },
              ].map(insight => (
                <div key={insight.title} className="flex gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="text-lg flex-shrink-0">{insight.icon}</span>
                  <div>
                    <p className="font-medium text-slate-200 text-xs">{insight.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{insight.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-6 pb-4 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>Data: BigQuery export via Supabase · {weeklyAov.length} weekly data points · 547K orders analysed</span>
          <span>MFC Commercial Dashboard · Next.js + Supabase + Vercel</span>
        </footer>
      </main>
    </div>
  )
}
