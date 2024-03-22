CREATE FUNCTION search_wallpapers(
  query_embedding VECTOR(384),
  threshold FLOAT = 0.8,
  quantity INTEGER = 10
)
RETURNS SETOF wallpapers
LANGUAGE sql
AS $$
  SELECT id, slug, description, raw_url, regular_url, thumbnail_url, width, height, tags
  FROM wallpapers
  WHERE embedding <#> query_embedding < -threshold
  ORDER BY embedding <#> query_embedding
  LIMIT LEAST(quantity, 100)
$$;