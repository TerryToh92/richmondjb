-- ============================================================
-- Ivy Goh Property — Supabase schema
-- 在 Supabase 后台 SQL Editor 整段贴上跑一次即可（可重复跑，安全）。
-- ============================================================

-- 1) listings 表（= 前端 Listing 型别）
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_en text not null default '',
  developer text not null default 'KSL',
  project_type text not null default 'new_launch',   -- new_launch | subsale | rent
  area text not null default '',
  city text not null default 'Johor Bahru',
  price_from integer not null default 0,
  bedrooms text not null default '',
  bathrooms text not null default '',
  size_sqft text not null default '',
  tenure text not null default 'Freehold / 永久地契',
  highlights text[] not null default '{}',
  description text not null default '',
  images text[] not null default '{}',
  lat double precision,
  lng double precision,
  built_year text not null default '',
  parking text not null default '',
  furnishing text not null default '',
  facing text not null default '',
  amenities text[] not null default '{}',
  -- KPKT 合规
  kpkt_developer_license text not null default '待 KSL 提供 / TBD',
  kpkt_ad_permit text not null default '待 KSL 提供 / TBD',
  kpkt_valid_until text not null default '待 KSL 提供 / TBD',
  kpkt_filled boolean not null default false,
  -- KSL 审批闸门
  status text not null default 'draft',               -- draft | pending_approval | approved | sold
  approved_by text,
  approved_at text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) updated_at 自动更新
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- 3) Row Level Security
alter table public.listings enable row level security;

-- 公开访客：只能看 已批准 / 已售 的房源
drop policy if exists "public read published" on public.listings;
create policy "public read published" on public.listings
  for select to anon using (status in ('approved','sold'));

-- 登录用户（Ivy）：看全部 + 增删改
drop policy if exists "auth read all" on public.listings;
create policy "auth read all" on public.listings
  for select to authenticated using (true);

drop policy if exists "auth write" on public.listings;
create policy "auth write" on public.listings
  for all to authenticated using (true) with check (true);

-- 4) 图片 Storage bucket（公开读，登录用户可上传）
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

drop policy if exists "listing imgs public read" on storage.objects;
create policy "listing imgs public read" on storage.objects
  for select using (bucket_id = 'listings');

drop policy if exists "listing imgs auth write" on storage.objects;
create policy "listing imgs auth write" on storage.objects
  for all to authenticated
  using (bucket_id = 'listings') with check (bucket_id = 'listings');
