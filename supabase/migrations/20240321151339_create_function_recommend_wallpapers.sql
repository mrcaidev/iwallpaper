CREATE TYPE recommend_wallpapers_returns AS (
  id UUID,
  slug TEXT,
  description TEXT,
  pathname TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[]
);

CREATE FUNCTION recommend_wallpapers(quantity INTEGER)
RETURNS SETOF recommend_wallpapers_returns
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
          SELECT UNNEST(wallpapers.most_similar_wallpapers) AS candidates, histories.rating
          FROM wallpapers
          RIGHT OUTER JOIN histories on wallpapers.id = histories.wallpaper_id
          WHERE histories.user_id = auth.uid()
            AND histories.rating IS NOT NULL
        ) AS candidates_subquery
        WHERE (candidates->>'id')::UUID NOT IN (
          SELECT wallpaper_id
          FROM histories
          WHERE user_id = auth.uid()
        )
        ORDER BY rating * (candidates->>'similarity')::FLOAT DESC
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
    SELECT id, slug, description, raw_url, regular_url, thumbnail_url, width, height, tags
    FROM wallpapers
    WHERE id = ANY(recommended_ids)
  );
END;
$$;
