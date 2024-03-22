CREATE TYPE search_wallpapers_returns AS (
  id UUID,
  slug TEXT,
  description TEXT,
  raw_url TEXT,
  regular_url TEXT,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[]
);

CREATE FUNCTION search_wallpapers(
  query_embedding VECTOR(384),
  threshold FLOAT,
  quantity INTEGER
)
RETURNS SETOF search_wallpapers_returns
LANGUAGE sql
AS $$
  SELECT id, slug, description, raw_url, regular_url, thumbnail_url, width, height, tags
  FROM wallpapers
  WHERE embedding <#> query_embedding < -threshold
  ORDER BY embedding <#> query_embedding ASC
  LIMIT LEAST(quantity, 100)
$$;
