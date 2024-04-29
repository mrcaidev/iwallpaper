CREATE FUNCTION recommend_wallpapers(take INTEGER)
RETURNS TABLE (
  id UUID,
  pathname TEXT,
  description TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  recommended_ids UUID[];
BEGIN
  recommended_ids = ARRAY(
    (
      SELECT DISTINCT recommended_id
      FROM (
        SELECT (candidates->>'id')::UUID AS recommended_id
        FROM (
          SELECT UNNEST(wallpapers.most_similar_wallpapers) AS candidates, histories.preference
          FROM histories
          LEFT OUTER JOIN wallpapers ON histories.wallpaper_id = wallpapers.id
          WHERE histories.preference IS NOT NULL
        ) AS candidates_subquery
        WHERE (candidates->>'id')::UUID NOT IN (
          SELECT wallpaper_id
          FROM histories
        )
        ORDER BY preference * (candidates->>'similarity')::FLOAT DESC
      ) AS rank_subquery
      LIMIT take
    )
    UNION ALL
    (
      SELECT wallpapers.id
      FROM wallpapers
      TABLESAMPLE SYSTEM_ROWS(take)
    )
    LIMIT take
  );

  IF auth.uid() IS NOT NULL THEN
    INSERT INTO histories (user_id, wallpaper_id)
    SELECT auth.uid(), recommended_id
    FROM UNNEST(recommended_ids) AS t(recommended_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN QUERY (
    SELECT
      wallpapers.id,
      wallpapers.pathname,
      wallpapers.description,
      wallpapers.width,
      wallpapers.height,
      wallpapers.tags
    FROM wallpapers
    WHERE wallpapers.id = ANY(recommended_ids)
  );
END;
$$;
