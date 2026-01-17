create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency text not null default 'MGA',
  language text not null default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- FUNCTION: auto update updated_at
-- =====================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================
drop trigger if exists set_user_preferences_updated_at on public.user_preferences;
create trigger set_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

-- =====================================================
-- ENABLE RLS
-- =====================================================
alter table public.user_preferences enable row level security;

-- =====================================================
-- USER PREFERENCES POLICIES
-- =====================================================
drop policy if exists "Users can view their preferences" on public.user_preferences;
create policy "Users can view their preferences"
on public.user_preferences
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their preferences" on public.user_preferences;
create policy "Users can insert their preferences"
on public.user_preferences
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their preferences" on public.user_preferences;
create policy "Users can update their preferences"
on public.user_preferences
for update
using (auth.uid() = user_id);

drop policy if exists "Users can delete their preferences" on public.user_preferences;
create policy "Users can delete their preferences"
on public.user_preferences
for delete
using (auth.uid() = user_id);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
create index if not exists idx_user_preferences_user_id on public.user_preferences(user_id);
