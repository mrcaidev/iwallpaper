create extension if not exists vector;
create extension if not exists tsm_system_rows;

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nick_name text default null,
  avatar_url text default null
);

alter table public.profiles enable row level security;
create policy "Users can select all profiles." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

create function auth.sync_profile()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
end;
$$ language plpgsql security definer;

create trigger sync_profile
after insert on auth.users
for each row execute function auth.sync_profile();

create table public.wallpapers (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  description text,
  raw_url text not null,
  regular_url text not null,
  thumbnail_url text not null,
  width integer not null,
  height integer not null,
  tags text[] not null,
  popularity integer default 0 not null
);

alter table public.wallpapers enable row level security;
create policy "Users can select all wallpapers." on public.wallpapers for select using (true);

create table public.histories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  wallpaper_id uuid not null references public.wallpapers on delete cascade,
  rating smallint check (rating between 0 and 5),
  is_implicitly_liked boolean generated always as (rating >= 3) stored not null,
  is_explicitly_liked boolean default false not null,
  unique (user_id, wallpaper_id)
);

alter table public.histories enable row level security;
create policy "Users can select all histories." on public.histories for select using (true);
create policy "Users can update their own history." on public.histories for update using (auth.uid() = user_id);

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  from_id uuid not null references auth.users on delete cascade,
  to_id uuid not null references auth.users on delete cascade,
  unique (from_id, to_id)
);

alter table public.subscriptions enable row level security;
create policy "Users can select their own subscription." on public.subscriptions for select using (auth.uid() = from_id);
create policy "Users can insert their own subscription." on public.subscriptions for insert with check (auth.uid() = from_id);
create policy "Users can delete their own subscription." on public.subscriptions for delete using (auth.uid() = from_id);

create schema vecs;

create table vecs.wallpapers (
  id uuid primary key references public.wallpapers on delete cascade,
  vec vector(384) default array_fill(0, array[384])::vector not null,
  metadata jsonb default '{}'::jsonb not null
);

alter table vecs.wallpapers enable row level security;

create function public.search_wallpapers (query vector, quantity integer)
returns setof public.wallpapers as $$
begin
  return query (
    select w.*
    from public.wallpapers w
    join unnest(array(
      select id
      from vecs.wallpapers
      order by vec <=> query
      limit quantity
    ))
    with ordinality t(id, ord) using (id)
    order by t.ord
  );
end;
$$ language plpgsql security definer;

create function public.update_wallpaper_popularity()
returns trigger as $$
declare
  difference integer;
begin
  if new.is_implicitly_liked = true then
    difference := 1;
  else
    difference := -1;
  end if;

  update public.wallpapers
  set popularity = popularity + difference
  where id = new.wallpaper_id;
end;

$$ language plpgsql security definer;

create function public.calculate_wallpaper_similarity()
returns float as $$
declare
  popularity_threshold integer;
  first_popularity integer;
  second_popularity integer;
  both_popularity integer;
begin
  popularity_threshold = (
    select count(*)
    from auth.users
  ) * 0.3;

  if popularity_threshold < 10 then
    popularity_threshold = 10;
  end if;

  first_popularity := (
    select popularity
    from public.wallpapers
    where id = first_id
  );

  second_popularity := (
    select popularity
    from public.wallpapers
    where id = second_id
  );

  if first_popularity >= popularity_threshold
    and second_popularity >= popularity_threshold
  then
    both_popularity = (
      select count(*)
      from public.histories
      where (wallpaper_id = first_id or wallpaper_id = second_id)
        and is_implicitly_liked = true
      group by user_id
      having count(*) = 2
    );
    return both_popularity / sqrt(first_popularity * second_popularity);
  else
    return 1 - ((
      select vec
      from vecs.wallpapers
      where id = first_id
    ) <=> (
      select vec
      from vecs.wallpapers
      where id = second_id
    ));
  end if;
end;
$$ language plpgsql security definer;
