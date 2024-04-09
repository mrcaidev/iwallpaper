CREATE FUNCTION search_wallpapers(
  query TEXT,
  query_embedding VECTOR(384),
  limit INTEGER = 30,
  offset INTEGER = 0,
  full_text_weight FLOAT = 1.0,
  semantic_weight FLOAT = 1.0,
  rrf_k INTEGER = 1
)
RETURNS SETOF frontend_wallpaper
LANGUAGE sql
AS $$
WITH full_text AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY TS_RANK_CD(fts, websearch_to_tsquery('english', query)) DESC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(limit, 30) + offset
),
semantic AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY embedding <#> query_embedding ASC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(limit, 30) + offset
),
dedicated_histories AS (
  SELECT *
  FROM histories
  WHERE user_id = auth.uid()
)
SELECT
  wallpapers.id,
  wallpapers.slug,
  wallpapers.pathname,
  wallpapers.description,
  wallpapers.width,
  wallpapers.height,
  wallpapers.tags,
  dedicated_histories.attitude
FROM full_text
FULL OUTER JOIN semantic ON full_text.id = semantic.id
LEFT OUTER JOIN wallpapers ON wallpapers.id = COALESCE(full_text.id, semantic.id)
LEFT OUTER JOIN dedicated_histories ON wallpapers.id = dedicated_histories.wallpaper_id
ORDER BY
  COALESCE(1.0 / (rrf_k + full_text.rank), 0.0) * full_text_weight +
  COALESCE(1.0 / (rrf_k + semantic.rank), 0.0) * semantic_weight
  DESC
LIMIT LEAST(limit, 30)
OFFSET offset
$$;
