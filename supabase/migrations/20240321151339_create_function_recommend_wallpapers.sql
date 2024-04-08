CREATE FUNCTION recommend_wallpapers(quantity INTEGER)
RETURNS SETOF frontend_wallpaper
LANGUAGE plpgsql
AS $$
DECLARE
  recommended_ids UUID[];
BEGIN
  recommended_ids = ARRAY(
    (
      SELECT DISTINCT id
      FROM (
        SELECT (candidates->>'id')::UUID AS id
        FROM (
          SELECT UNNEST(wallpapers.most_similar_wallpapers) AS candidates, histories.preference
          FROM histories
          LEFT OUTER JOIN wallpapers ON histories.wallpaper_id = wallpapers.id
          WHERE histories.user_id = auth.uid()
            AND histories.preference IS NOT NULL
        ) AS candidates_subquery
        WHERE (candidates->>'id')::UUID NOT IN (
          SELECT wallpaper_id
          FROM histories
          WHERE user_id = auth.uid()
        )
        ORDER BY preference * (candidates->>'similarity')::FLOAT DESC
      ) AS rank_subquery
      LIMIT quantity
    )
    UNION ALL
    (
      SELECT id
      FROM wallpapers
      TABLESAMPLE SYSTEM_ROWS(quantity)
    )
    LIMIT quantity
  );

  INSERT INTO histories (user_id, wallpaper_id)
  SELECT auth.uid(), id
  FROM UNNEST(recommended_ids) AS t(id)
  ON CONFLICT DO NOTHING;

  RETURN QUERY (
    SELECT
      id,
      slug,
      pathname,
      description,
      width,
      height,
      tags,
      NULL AS liked_at
    FROM wallpapers
    WHERE id = ANY(recommended_ids)
  );
END;
$$;
