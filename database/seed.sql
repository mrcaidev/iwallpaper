create extension if not exists vector;
create extension if not exists tsm_system_rows;

create schema if not exists vecs;

drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nick_name text default null,
  avatar_url text default null
);

alter table public.profiles enable row level security;
create policy "User can select every profile." on public.profiles for select using (true);

drop table if exists public.wallpapers cascade;

create table public.wallpapers (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  raw_url text not null,
  regular_url text not null,
  thumbnail_url text not null,
  width integer not null,
  height integer not null,
  tags text[] not null
);

alter table public.wallpapers enable row level security;
create policy "User can select every wallpaper." on public.wallpapers for select using (true);

drop table if exists public.histories cascade;

create table public.histories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  wallpaper_id uuid not null references public.wallpapers on delete cascade,
  is_scrutinized boolean default false not null,
  is_liked boolean default false not null,
  is_hidden boolean default false not null,
  is_downloaded boolean default false not null,
  unique (user_id, wallpaper_id)
);

alter table public.histories enable row level security;
create policy "User can select every history." on public.histories for select using (true);
create policy "User can update his own history." on public.histories for update using (auth.uid() = user_id);

drop table if exists public.subscriptions cascade;

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  from_id uuid not null references auth.users on delete cascade,
  to_id uuid not null references auth.users on delete cascade,
  unique (from_id, to_id)
);

alter table public.subscriptions enable row level security;
create policy "User can select his own subscription." on public.subscriptions for select using (auth.uid() = from_id);
create policy "User can insert his own subscription." on public.subscriptions for insert with check (auth.uid() = from_id);
create policy "User can delete his own subscription." on public.subscriptions for delete using (auth.uid() = from_id);

drop function if exists public.generate_random_preference_vector cascade;

create function public.generate_random_preference_vector()
returns vector as $$
begin
  return array(select random() * 0.1 from generate_series(1, 2000))::vector;
end;
$$ language plpgsql security definer;

drop table if exists vecs.preference_vectors cascade;

create table vecs.preference_vectors (
  id uuid primary key references auth.users on delete cascade,
  vec vector(2000) default public.generate_random_preference_vector() not null,
  metadata jsonb default '{}'::jsonb not null
);

alter table vecs.preference_vectors enable row level security;

drop table if exists vecs.tag_vectors cascade;

create table vecs.tag_vectors (
  id uuid primary key references public.wallpapers on delete cascade,
  vec vector(2000) default array_fill(0, array[2000])::vector not null,
  metadata jsonb default '{}'::jsonb not null
);

alter table vecs.tag_vectors enable row level security;

drop function if exists auth.sync_user cascade;

create function auth.sync_user()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, nick_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'nick_name', new.raw_user_meta_data->>'avatar_url');
    insert into vecs.preference_vectors (id)
    values (new.id);

  elsif tg_op = 'UPDATE' then
    update public.profiles
    set nick_name = new.raw_user_meta_data->>'nick_name',
      avatar_url = new.raw_user_meta_data->>'avatar_url'
    where id = new.id;

  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger sync_user
after insert or update of raw_user_meta_data on auth.users
for each row execute function auth.sync_user();

drop function if exists public.vector_mul cascade;

create function public.vector_mul(vector, float)
returns vector as $$
begin
  return (array(select unnest(vector_to_float4($1, 0, false)) * $2))::vector;
end;
$$ language plpgsql security definer;

drop function if exists public.update_preference cascade;

create function public.update_preference(user_id uuid, wallpaper_id uuid, weight integer)
returns void as $$
begin
  update vecs.preference_vectors
  set vec = vec + vector_mul(
    (select vec from vecs.tag_vectors where id = wallpaper_id),
    weight
  )
  where id = user_id;
end;
$$ language plpgsql security definer;

drop function if exists public.update_preference_after_update_history cascade;

create function public.update_preference_after_update_history()
returns trigger as $$
declare
  weight integer := 0;
begin
  if old.is_scrutinized = false and new.is_scrutinized = true then
    weight = weight + 1;
  elsif old.is_scrutinized = true and new.is_scrutinized = false then
    weight = weight - 1;
  end if;

  if old.is_liked = false and new.is_liked = true then
    weight = weight + 3;
  elsif old.is_liked = true and new.is_liked = false then
    weight = weight - 3;
  end if;

  if old.is_downloaded = false and new.is_downloaded = true then
    weight = weight + 5;
  elsif old.is_downloaded = true and new.is_downloaded = false then
    weight = weight - 5;
  end if;

  if old.is_hidden = false and new.is_hidden = true then
    weight = weight - 3;
  elsif old.is_hidden = true and new.is_hidden = false then
    weight = weight + 3;
  end if;

  if weight != 0 then
    perform public.update_preference(new.user_id, new.wallpaper_id, weight);
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger update_preference_after_update_history
after update on public.histories
for each row execute function public.update_preference_after_update_history();

drop function if exists public.search_wallpapers cascade;

create function public.search_wallpapers (query vector, quantity integer)
returns setof public.wallpapers as $$
begin
  return query (
    select w.*
    from public.wallpapers w
    join unnest(array(
      select id
      from vecs.tag_vectors
      order by vec <=> query
      limit quantity
    ))
    with ordinality t(id, ord) using (id)
    order by t.ord
  );
end;
$$ language plpgsql security definer;

drop function if exists public.recommend_wallpapers cascade;

create function public.recommend_wallpapers(quantity integer default 10)
returns setof public.wallpapers as $$
declare
  preference_vector vector;
  seen_ids uuid[];

  content_based_ids uuid[];
  user_based_ids uuid[];
  random_ids uuid[];

  recommended_ids uuid[];
begin
  if auth.uid() is null then
    return query (
      select *
      from public.wallpapers
      tablesample system_rows(quantity)
    );
    return;
  end if;

  select vec
  into preference_vector
  from vecs.preference_vectors
  where id = auth.uid();

  seen_ids := array(
    select wallpaper_id
    from public.histories
    where user_id = auth.uid()
  );

  content_based_ids := array(
    select id
    from vecs.tag_vectors
    where id != any(seen_ids)
    order by vec <=> preference_vector
    limit floor(quantity * 0.5)
  );

  user_based_ids := array(
    select wallpaper_id
    from public.histories
    where user_id in (
      select id
      from vecs.preference_vectors
      order by vec <=> preference_vector
      limit 3
    )
    and is_liked = true
    limit floor(quantity * 0.3)
  );

  random_ids := array(
    select id
    from public.wallpapers
    tablesample system_rows(quantity - cardinality(content_based_ids) - cardinality(user_based_ids))
  );

  recommended_ids := content_based_ids || user_based_ids || random_ids;

  insert into public.histories (user_id, wallpaper_id)
  select auth.uid(), id
  from unnest(recommended_ids) as t(id)
  on conflict do nothing;

  return query (
    select *
    from public.wallpapers
    where id = any(recommended_ids)
  );
end;
$$ language plpgsql security definer;
