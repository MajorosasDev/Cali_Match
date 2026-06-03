-- ─── Tabla groups ──────────────────────────────────────────────────────────────
create table if not exists public.groups (
  id text primary key,
  code text,
  name text not null,
  size integer default 4,
  type text,
  created_by text,
  status text not null default 'active',
  finalized_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.groups add column if not exists code text;
alter table public.groups add column if not exists name text;
alter table public.groups add column if not exists size integer default 4;
alter table public.groups add column if not exists type text;
alter table public.groups add column if not exists created_by text;
alter table public.groups add column if not exists status text default 'active';
alter table public.groups add column if not exists finalized_at timestamptz;
alter table public.groups add column if not exists created_at timestamptz default now();

-- ─── Tabla group_details ───────────────────────────────────────────────────────
create table if not exists public.group_details (
  id uuid primary key default gen_random_uuid(),
  group_id text not null unique references public.groups(id) on delete cascade,
  code text,
  members jsonb not null default '[]'::jsonb,
  quiz_answers jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.group_details add column if not exists group_id text;
alter table public.group_details add column if not exists code text;
alter table public.group_details add column if not exists members jsonb default '[]'::jsonb;
alter table public.group_details add column if not exists quiz_answers jsonb default '{}'::jsonb;
alter table public.group_details add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.group_details add column if not exists created_at timestamptz default now();

-- ─── Índices ───────────────────────────────────────────────────────────────────
create unique index if not exists group_details_group_id_idx on public.group_details(group_id);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table public.groups enable row level security;
alter table public.group_details enable row level security;

create policy if not exists "Auth read groups"   on public.groups for select using (auth.role() = 'authenticated');
create policy if not exists "Auth insert groups" on public.groups for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth update groups" on public.groups for update using (auth.role() = 'authenticated');

create policy if not exists "Auth read group_details"   on public.group_details for select using (auth.role() = 'authenticated');
create policy if not exists "Auth insert group_details" on public.group_details for insert with check (auth.role() = 'authenticated');
create policy if not exists "Auth update group_details" on public.group_details for update using (auth.role() = 'authenticated');
