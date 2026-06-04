-- ─── telegram_users ──────────────────────────────────────────────────────────
-- Almacena los usuarios de Telegram que interactuaron con el bot.
-- Vincula un chat_id con el group_id enviado en el comando /start.
create table if not exists public.telegram_users (
  id         uuid        primary key default gen_random_uuid(),
  chat_id    text        not null,
  username   text,
  group_id   text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.telegram_users add column if not exists chat_id    text;
alter table public.telegram_users add column if not exists username   text;
alter table public.telegram_users add column if not exists group_id   text;
alter table public.telegram_users add column if not exists updated_at timestamptz default now();

create unique index if not exists telegram_users_chat_id_idx
  on public.telegram_users (chat_id);

alter table public.telegram_users enable row level security;

drop policy if exists "Public read telegram_users"   on public.telegram_users;
drop policy if exists "Public insert telegram_users" on public.telegram_users;
drop policy if exists "Public update telegram_users" on public.telegram_users;

create policy "Public read telegram_users"
  on public.telegram_users for select using (true);
create policy "Public insert telegram_users"
  on public.telegram_users for insert with check (true);
create policy "Public update telegram_users"
  on public.telegram_users for update using (true) with check (true);


-- ─── group_recommendations ────────────────────────────────────────────────────
-- Historial de recomendaciones generadas por grupo
create table if not exists public.group_recommendations (
  id             uuid        primary key default gen_random_uuid(),
  group_id       text        not null,
  score          integer,
  insights       jsonb       default '[]'::jsonb,
  top_lugares    jsonb       default '[]'::jsonb,
  explicacion    text,
  telegram_sent  boolean     default false,
  created_at     timestamptz default now()
);

alter table public.group_recommendations add column if not exists group_id      text;
alter table public.group_recommendations add column if not exists score         integer;
alter table public.group_recommendations add column if not exists insights      jsonb   default '[]'::jsonb;
alter table public.group_recommendations add column if not exists top_lugares   jsonb   default '[]'::jsonb;
alter table public.group_recommendations add column if not exists explicacion   text;
alter table public.group_recommendations add column if not exists telegram_sent boolean default false;

create index if not exists group_recommendations_group_id_idx
  on public.group_recommendations (group_id);

alter table public.group_recommendations enable row level security;

drop policy if exists "Public read group_recommendations"    on public.group_recommendations;
drop policy if exists "Public insert group_recommendations"  on public.group_recommendations;
drop policy if exists "Public update group_recommendations"  on public.group_recommendations;

create policy "Public read group_recommendations"
  on public.group_recommendations for select using (true);
create policy "Public insert group_recommendations"
  on public.group_recommendations for insert with check (true);
create policy "Public update group_recommendations"
  on public.group_recommendations for update using (true) with check (true);
