create table if not exists weekly_aov (
  id bigint generated always as identity primary key,
  week date not null,
  warehouse text not null,
  aov numeric(12,2),
  median_basket numeric(12,2),
  orders integer,
  total_rev numeric(16,2),
  aov_change_pct numeric(8,2)
);

create table if not exists monthly_summary (
  id bigint generated always as identity primary key,
  month text not null,
  warehouse text not null,
  rev numeric(16,2),
  margin numeric(16,2),
  margin_pct numeric(8,2),
  avg_aov numeric(12,2),
  total_orders integer
);

create table if not exists category_mix (
  id bigint generated always as identity primary key,
  month text not null,
  warehouse text not null,
  category text not null,
  revenue numeric(16,2),
  share numeric(8,2)
);

create table if not exists top_skus (
  id bigint generated always as identity primary key,
  warehouse text not null,
  sku text,
  product text,
  cat1 text,
  total_rev numeric(16,2),
  total_qty numeric(16,2),
  weeks_active integer,
  share numeric(8,3)
);

create table if not exists spike_events (
  id bigint generated always as identity primary key,
  week date not null,
  warehouse text not null,
  aov numeric(12,2),
  aov_change_pct numeric(8,2),
  orders integer,
  total_rev numeric(16,2),
  top_gainers text
);

create table if not exists paycheck_pattern (
  id bigint generated always as identity primary key,
  warehouse text not null,
  period text not null,
  avg_aov numeric(12,2),
  sample_weeks integer
);

create table if not exists new_skus_2026 (
  id bigint generated always as identity primary key,
  warehouse text not null,
  sku text,
  product text,
  category text,
  revenue numeric(16,2)
);

alter table weekly_aov enable row level security;
alter table monthly_summary enable row level security;
alter table category_mix enable row level security;
alter table top_skus enable row level security;
alter table spike_events enable row level security;
alter table paycheck_pattern enable row level security;
alter table new_skus_2026 enable row level security;

create policy "public read" on weekly_aov for select using (true);
create policy "public read" on monthly_summary for select using (true);
create policy "public read" on category_mix for select using (true);
create policy "public read" on top_skus for select using (true);
create policy "public read" on spike_events for select using (true);
create policy "public read" on paycheck_pattern for select using (true);
create policy "public read" on new_skus_2026 for select using (true);
