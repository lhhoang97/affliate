# Supabase Setup

## 1) Environment variables (.env)
Create a `.env` file in the project root with:

REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

Restart the dev server after changes.

## 2) Tables SQL (run in Supabase SQL editor)

-- Products
create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  description text not null,
  price numeric not null,
  original_price numeric,
  image text,
  rating numeric default 0,
  review_count integer default 0,
  category text not null,
  brand text not null,
  in_stock boolean default true,
  features jsonb default '[]',
  specifications jsonb default '{}',
  images jsonb default '[]',
  tags jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  description text,
  image text,
  product_count integer default 0,
  slug text unique
);

-- Row Level Security
alter table public.products enable row level security;
alter table public.categories enable row level security;

-- Anonymous read access (optional)
create policy "Allow anon read products" on public.products
for select using (true);

create policy "Allow anon read categories" on public.categories
for select using (true);

-- Insert/Update/Delete policies should be restricted to service role or authenticated users as needed.
