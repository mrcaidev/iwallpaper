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
  itemcf_ids UUID[];
  random_ids UUID[];
  recommended_ids UUID[];
BEGIN
  itemcf_ids = ARRAY(
    WITH scores AS (
      SELECT JSONB_ARRAY_ELEMENTS(w.most_similar_wallpapers)->>'id' AS id,
        rating * (JSONB_ARRAY_ELEMENTS(w.most_similar_wallpapers)->>'similarity') AS score
      FROM histories h
      LEFT OUTER JOIN wallpapers w on h.wallpaper_id = w.id
      WHERE h.user_id = auth.uid()
        AND h.rating IS NOT NULL
    )
    SELECT id
    FROM scores
    WHERE id NOT IN (
      SELECT id
      FROM histories
      WHERE user_id = auth.uid()
    )
    ORDER BY score DESC
    LIMIT quantity
  );

  random_ids = ARRAY(
    SELECT id
    FROM wallpapers
    TABLESAMPLE SYSTEM_ROWS(quantity - CARDINALITY(itemcf_ids))
  );

  recommended_ids = itemcf_ids || random_ids;

  INSERT INTO histories (user_id, wallpaper_id)
  SELECT auth.uid(), id
  FROM UNNEST(recommended_ids) AS t(id);

  RETURN QUERY (
    SELECT id, slug, description, raw_url, regular_url, thumbnail_url, width, height, tags
    FROM wallpapers
    WHERE id = ANY(recommended_ids)
  );
END;
$$;
