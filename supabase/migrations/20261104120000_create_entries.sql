-- Littlepreneurs Season 02 registrations.
-- One table for both registration types:
--   kind = 'guest' : a visitor (name, email, phone)
--   kind = 'stall' : a child's / two children's stall or brand
--
-- Paste into the Supabase SQL editor, or run with `supabase db push`.
create extension if not exists pgcrypto;

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'guest' check (kind in ('guest', 'stall')),
  name text not null,           -- visitor, or parent / guardian for a stall
  email text not null,
  number text not null,         -- E.164, e.g. +919876543210

  -- stall registrations only
  stall_name text,
  category text,
  table_type text check (table_type in ('single', 'shared')),
  child_name text,
  child_age smallint check (child_age between 4 and 16),
  child2_name text,
  child2_age smallint check (child2_age between 4 and 16),

  checkedin boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists entries_created_at_idx on public.entries (created_at desc);
create index if not exists entries_kind_idx on public.entries (kind);

-- One visitor pass per phone number. A parent may register several stalls
-- (one per child / table) with the same number.
create unique index if not exists entries_guest_number_key on public.entries (number) where kind = 'guest';

-- RLS on with NO policies: the public (anon) key can't read or write
-- anything. All access goes through the Next.js server using the secret key,
-- which bypasses RLS.
alter table public.entries enable row level security;

notify pgrst, 'reload schema';
