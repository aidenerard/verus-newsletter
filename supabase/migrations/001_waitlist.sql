create table public.waitlist (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null unique,
  company text,
  created_at timestamptz default now()
);
alter table public.waitlist enable row level security;
create policy "Anyone can insert" on public.waitlist for insert with check (true);
create policy "Only service role can read" on public.waitlist for select using (false);
