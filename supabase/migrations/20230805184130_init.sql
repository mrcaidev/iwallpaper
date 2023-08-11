-- Enable json schema validation.
create extension if not exists pg_jsonschema;

-- Validate auth.users.raw_user_meta_data.
alter table auth.users add constraint users_raw_user_meta_data_check check (
  jsonb_matches_schema(
    '{
      "type": "object",
      "properties": {
        "nick_name": {
          "type": ["string", "null"],
          "maxLength": 20,
          "minLength": 2
        },
        "avatar_url": {
          "type": ["string", "null"],
          "format": "uri"
        }
      },
      "required": [
        "nick_name",
        "avatar_url"
      ]
    }',
    raw_user_meta_data
  )
);

-- Enable vector.
create extension if not exists vector;

-- Generate random vector.
create function generate_random_vector(dimension integer)
returns vector as $$
begin
  return array(select random() from generate_series(1, dimension))::vector;
end;
$$ language plpgsql;

-- User public profiles.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nick_name text default null,
  avatar_url text default null,
  embedding vector(384) default generate_random_vector(384) not null
);

alter table profiles enable row level security;
create policy "User can select every profile." on profiles for select using (true);

-- Wallpapers.
create table wallpapers (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  pathname text not null,
  width integer not null,
  height integer not null,
  blur text not null,
  description text not null,
  tags text[] not null,
  embedding vector(384) not null
);

alter table wallpapers enable row level security;
create policy "User can select every wallpaper." on wallpapers for select using (true);

-- User browsing histories.
create table histories (
  user_id uuid references auth.users on delete cascade,
  wallpaper_id uuid references wallpapers on delete cascade,
  scrutinized_at timestamptz default null,
  liked_at timestamptz default null,
  downloaded_at timestamptz default null,
  hidden_at timestamptz default null,
  primary key (user_id, wallpaper_id)
);

alter table histories enable row level security;
create policy "User can select every history." on histories for select using (true);
create policy "User can update his own history." on histories for update using (auth.uid() = user_id);

-- User subscriptions.
create table subscriptions (
  from_id uuid references auth.users on delete cascade,
  to_id uuid references auth.users on delete cascade,
  primary key (from_id, to_id)
);

alter table subscriptions enable row level security;
create policy "User can select his own subscription." on subscriptions for select using (auth.uid() = from_id);
create policy "User can insert his own subscription." on subscriptions for insert with check (auth.uid() = from_id);
create policy "User can delete his own subscription." on subscriptions for delete using (auth.uid() = from_id);

-- Sync auth.users.raw_user_meta_data to public.profiles.
create function sync_profile()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into profiles (id) values (new.id);

  elsif tg_op = 'UPDATE' then
    update profiles
    set nick_name = new.raw_user_meta_data->>'nick_name',
      avatar_url = new.raw_user_meta_data->>'avatar_url'
    where id = new.id;

  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger sync_profile
after insert or update of raw_user_meta_data on auth.users
for each row execute function sync_profile();

-- Vector multiplication.
create function vector_mul(vector vector, constant float)
returns vector as $$
begin
  return array(select unnest(vector_to_float4(vector, 0, false)) * constant)::vector;
end;
$$ language plpgsql;

-- Update user preference after he reacts to a wallpaper.
create function update_preference_after_update_history()
returns trigger as $$
declare
  weight integer := 0;
begin
  -- Scrutize = +1
  if old.scrutinized_at is null and new.scrutinized_at is not null then
    weight = weight + 1;
  elsif old.scrutinized_at is not null and new.scrutinized_at is null then
    weight = weight - 1;
  end if;

  -- Like = +3
  if old.liked_at is null and new.liked_at is not null then
    weight = weight + 3;
  elsif old.liked_at is not null and new.liked_at is null then
    weight = weight - 3;
  end if;

  -- Download = +5
  if old.downloaded_at is null and new.downloaded_at is not null then
    weight = weight + 5;
  elsif old.downloaded_at is not null and new.downloaded_at is null then
    weight = weight - 5;
  end if;

  -- Hide = -3
  if old.hidden_at is null and new.hidden_at is not null then
    weight = weight - 3;
  elsif old.hidden_at is not null and new.hidden_at is null then
    weight = weight + 3;
  end if;

  if weight != 0 then
    update profiles
    set embedding = embedding + vector_mul(
      (select embedding from wallpapers where id = new.wallpaper_id),
      weight
    )
    where id = new.user_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger update_preference_after_update_history
after update on histories
for each row execute function update_preference_after_update_history();

-- Search wallpapers by cosine similarity.
create function search_wallpapers(
  query vector(384),
  similarity_threshold float default 0.6,
  page integer default 1,
  per_page integer default 10
)
returns table (
  id uuid,
  pathname text,
  width integer,
  height integer,
  blur text,
  description text,
  tags text[],
  liked_at timestamptz,
  hidden_at timestamptz,
  similarity float
) as $$
begin
  return query (
    select
      w.id,
      w.pathname,
      w.width,
      w.height,
      w.blur,
      w.description,
      w.tags,
      h.liked_at,
      h.hidden_at,
      1 - (w.embedding <=> query) as similarity
    from wallpapers w
    left outer join histories h
      on w.id = h.wallpaper_id and h.user_id is not distinct from auth.uid()
    where 1 - (w.embedding <=> query) > similarity_threshold
    order by similarity desc
    limit per_page
    offset (page - 1) * per_page
  );
end;
$$ language plpgsql;

-- Enable table sampling.
create extension if not exists tsm_system_rows;

-- Recommend wallpapers.
create function recommend_wallpapers(quantity integer default 10)
returns table (
  id uuid,
  pathname text,
  width integer,
  height integer,
  blur text,
  description text,
  tags text[]
) as $$
declare
  preferred_count integer := floor(quantity * 0.7);
  recommended_wallpaper_ids uuid[];
begin
  if auth.uid() is null then
    return query (
      select id, pathname, width, height, blur, description, tags
      from wallpapers
      tablesample system_rows(quantity)
    );
    return;
  end if;

  recommended_wallpaper_ids = array(
    (
      select id
      from wallpapers
      where id not in (
        select wallpaper_id
        from histories
        where user_id = auth.uid()
      )
      order by embedding <=> (
        select embedding
        from profiles
        where id = auth.uid()
      )
      limit preferred_count
    )
    union
    (
      select id
      from wallpapers
      tablesample system_rows(quantity - preferred_count)
    )
  );

  insert into histories (user_id, wallpaper_id)
  select auth.uid(), id
  from unnest(recommended_wallpaper_ids) as t(id)
  on conflict do nothing;

  return query (
    select id, pathname, width, height, blur, description, tags
    from wallpapers
    where id = any(recommended_wallpaper_ids)
  );
end;
$$ language plpgsql security definer;
