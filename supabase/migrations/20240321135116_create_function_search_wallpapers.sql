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
WITH full_text_ranks AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY TS_RANK_CD(fts, websearch_to_tsquery('english', query)) DESC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(limit, 30) + offset
),
semantic_ranks AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY embedding <#> query_embedding ASC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(limit, 30) + offset
),
personal_histories AS (
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
  personal_histories.attitude
FROM full_text_ranks
FULL OUTER JOIN semantic_ranks ON full_text_ranks.id = semantic_ranks.id
LEFT OUTER JOIN wallpapers ON COALESCE(full_text_ranks.id, semantic_ranks.id) = wallpapers.id
LEFT OUTER JOIN personal_histories ON wallpapers.id = personal_histories.wallpaper_id
ORDER BY
  COALESCE(1.0 / (rrf_k + full_text_ranks.rank), 0.0) * full_text_weight +
  COALESCE(1.0 / (rrf_k + semantic_ranks.rank), 0.0) * semantic_weight
  DESC
LIMIT LEAST(limit, 30)
OFFSET offset
$$;
