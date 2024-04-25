CREATE FUNCTION search_wallpapers(
  query TEXT,
  query_embedding VECTOR(384),
  take INTEGER = 30,
  skip INTEGER = 0,
  similarity_threshold FLOAT = 0.8,
  keyword_weight FLOAT = 1.0,
  semantic_weight FLOAT = 1.0,
  rrf_k INTEGER = 1
)
RETURNS TABLE (
  id UUID,
  pathname TEXT,
  description TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[],
  attitude ATTITUDE
)
LANGUAGE sql
AS $$
WITH keyword_ranking AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY TS_RANK_CD(fts, websearch_to_tsquery('english', query)) DESC
  ) AS rank
  FROM wallpapers
  WHERE fts @@ websearch_to_tsquery('english', query)
  ORDER BY rank ASC
),
semantic_ranking AS (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY embedding <#> query_embedding ASC
  ) AS rank
  FROM wallpapers
  WHERE -(embedding <#> query_embedding) >= similarity_threshold
  ORDER BY rank ASC
)
SELECT
  wallpapers.id,
  wallpapers.pathname,
  wallpapers.description,
  wallpapers.width,
  wallpapers.height,
  wallpapers.tags,
  histories.attitude
FROM keyword_ranking
FULL OUTER JOIN semantic_ranking ON keyword_ranking.id = semantic_ranking.id
LEFT OUTER JOIN wallpapers ON COALESCE(keyword_ranking.id, semantic_ranking.id) = wallpapers.id
LEFT OUTER JOIN histories ON wallpapers.id = histories.wallpaper_id
ORDER BY
  keyword_weight * COALESCE(1.0 / (rrf_k + keyword_ranking.rank), 0.0) +
  semantic_weight * COALESCE(1.0 / (rrf_k + semantic_ranking.rank), 0.0)
  DESC
LIMIT LEAST(take, 30)
OFFSET skip
$$;
