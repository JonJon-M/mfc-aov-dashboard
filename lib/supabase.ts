import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WeeklyAOV = {
  id: number
  week: string
  warehouse: string
  aov: number
  median_basket: number
  orders: number
  total_rev: number
  aov_change_pct: number | null
}

export type MonthlySummary = {
  id: number
  month: string
  warehouse: string
  rev: number
  margin: number
  margin_pct: number
  avg_aov: number
  total_orders: number
}

export type CategoryMix = {
  id: number
  month: string
  warehouse: string
  category: string
  revenue: number
  share: number
}

export type TopSKU = {
  id: number
  warehouse: string
  sku: string
  product: string
  cat1: string
  total_rev: number
  total_qty: number
  weeks_active: number
  share: number
}

export type SpikeEvent = {
  id: number
  week: string
  warehouse: string
  aov: number
  aov_change_pct: number
  orders: number
  total_rev: number
  top_gainers: string
}

export type PaycheckPattern = {
  id: number
  warehouse: string
  period: string
  avg_aov: number
  sample_weeks: number
}

export type NewSKU = {
  id: number
  warehouse: string
  sku: string
  product: string
  category: string
  revenue: number
}
