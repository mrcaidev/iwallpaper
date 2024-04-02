CREATE TYPE search_wallpapers_returns AS (
  id UUID,
  slug TEXT,
  description TEXT,
  pathname TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[]
);

CREATE FUNCTION search_wallpapers(
  query TEXT,
  query_embedding VECTOR(384),
  quantity INTEGER,
  full_text_weight FLOAT = 1.0,
  semantic_weight FLOAT = 1.0,
  rrf_k INTEGER = 1
)
RETURNS SETOF search_wallpapers_returns
LANGUAGE sql
AS $$
WITH full_text AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY TS_RANK_CD(fts, websearch_to_tsquery('english', query)) DESC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(quantity, 100)
),
semantic AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY embedding <#> query_embedding ASC
  ) AS rank
  FROM wallpapers
  ORDER BY rank ASC
  LIMIT LEAST(quantity, 100)
)
SELECT
  wallpapers.id,
  wallpapers.slug,
  wallpapers.description,
  wallpapers.pathname,
  wallpapers.width,
  wallpapers.height,
  wallpapers.tags
FROM full_text
FULL OUTER JOIN semantic ON full_text.id = semantic.id
LEFT OUTER JOIN wallpapers ON wallpapers.id = COALESCE(full_text.id, semantic.id)
ORDER BY
  COALESCE(1.0 / (rrf_k + full_text.rank), 0.0) * full_text_weight +
  COALESCE(1.0 / (rrf_k + semantic.rank), 0.0) * semantic_weight
  DESC
LIMIT LEAST(quantity, 100)
$$;
