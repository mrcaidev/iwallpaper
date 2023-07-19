create extension if not exists vector;

create schema if not exists vecs;

drop table if exists vecs.preference_vectors cascade;
create table vecs.preference_vectors (
   id uuid primary key references auth.users on delete cascade,
   vec vector(1000) default array_fill(0, array[1000])::vector not null,
   metadata jsonb default '{}'::jsonb not null
);
alter table vecs.preference_vectors enable row level security;

drop function if exists auth.create_preference cascade;
create function auth.create_preference()
returns trigger as $$
begin
  insert into vecs.preference_vectors (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_sign_up
after insert on auth.users
for each row execute procedure auth.create_preference();

drop table if exists public.wallpapers cascade;
create table public.wallpapers (
   id uuid default gen_random_uuid() primary key,
   slug text not null unique,
   raw_url text not null,
   thumbnail_url text not null,
   tags text[] default '{}'::text[]
);
alter table public.wallpapers enable row level security;
create policy "User can select every wallpaper." on public.wallpapers for select using (true);

drop table if exists vecs.tag_vectors cascade;
create table vecs.tag_vectors (
   id uuid primary key references public.wallpapers on delete cascade,
   vec vector(1000) not null,
   metadata jsonb default '{}'::jsonb not null
);
alter table vecs.tag_vectors enable row level security;

drop table if exists public.responses cascade;
create table public.responses (
   id uuid default gen_random_uuid() primary key,
   user_id uuid not null references auth.users on delete cascade,
   wallpaper_id uuid not null references public.wallpapers on delete cascade,
   is_liked boolean default false not null,
   is_hidden boolean default false not null
);
alter table public.responses enable row level security;
create policy "User can select every history." on public.responses for select using (true);
create policy "User can insert his own history." on public.responses for insert with check (auth.uid() = user_id);
create policy "User can update his own history." on public.responses for delete using (auth.uid() = user_id);

drop table if exists public.subscriptions cascade;
create table public.subscriptions (
   id uuid default gen_random_uuid() primary key,
   from_id uuid not null references auth.users on delete cascade,
   to_id uuid not null references auth.users on delete cascade
);
alter table public.subscriptions enable row level security;
create policy "User can select his own subscription." on public.subscriptions for select using (auth.uid() = from_id);
create policy "User can insert his own subscription." on public.subscriptions for insert with check (auth.uid() = from_id);
create policy "User can delete his own subscription." on public.subscriptions for delete using (auth.uid() = from_id);
