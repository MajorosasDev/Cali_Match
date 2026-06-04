-- Crear tabla separada para datos de perfil de auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  email text,
  celular text,
  fecha_nacimiento date,
  onboarding_answers jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.profiles add column if not exists onboarding_answers jsonb default '{}'::jsonb;

alter table public.profiles enable row level security;

alter table public.profiles
  drop constraint if exists profiles_celular_10_digits,
  drop constraint if exists profiles_fecha_nacimiento_not_future;

alter table public.profiles
  add constraint profiles_celular_10_digits
  check (celular ~ '^[0-9]{10}$');

alter table public.profiles
  add constraint profiles_fecha_nacimiento_not_future
  check (fecha_nacimiento < current_date);

create policy if not exists "Usuarios pueden ver y editar su propio perfil"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
