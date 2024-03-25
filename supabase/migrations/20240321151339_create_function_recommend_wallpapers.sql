CREATE TYPE recommend_wallpapers_returns AS (
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

CREATE FUNCTION recommend_wallpapers(quantity INTEGER)
RETURNS SETOF recommend_wallpapers_returns
LANGUAGE plpgsql
AS $$
DECLARE
  recommended_ids UUID[];
BEGIN
  recommended_ids = ARRAY(
    (
      SELECT (candidates->>'id')::UUID
      FROM (
        SELECT UNNEST(w.most_similar_wallpapers) AS candidates, h.rating
        FROM wallpapers w
        RIGHT OUTER JOIN histories h on w.id = h.wallpaper_id
        WHERE h.user_id = auth.uid()
          AND h.rating IS NOT NULL
      ) AS subquery
      WHERE (candidates->>'id')::UUID NOT IN (
        SELECT wallpaper_id
        FROM histories
        WHERE user_id = auth.uid()
      )
      ORDER BY rating * (candidates->>'similarity')::FLOAT DESC
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
