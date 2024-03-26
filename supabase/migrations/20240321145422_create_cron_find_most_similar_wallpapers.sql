CREATE FUNCTION calculate_wallpaper_similarity(first_id UUID, second_id UUID)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  popularity_threshold INTEGER;
  first_popularity INTEGER;
  second_popularity INTEGER;
  both_popularity INTEGER;
BEGIN
  popularity_threshold = (
    SELECT COUNT(*)
    FROM auth.users
  ) * 0.1;
  popularity_threshold = GREATEST(popularity_threshold, 10);

  first_popularity = (
    SELECT popularity
    FROM wallpapers
    WHERE id = first_id
  );

  second_popularity = (
    SELECT popularity
    FROM wallpapers
    WHERE id = second_id
  );

  IF first_popularity >= popularity_threshold AND second_popularity >= popularity_threshold
  THEN
    both_popularity = (
      SELECT COUNT(*)
      FROM histories
      WHERE (wallpaper_id = first_id OR wallpaper_id = second_id)
        AND is_positive = TRUE
      GROUP BY user_id
      HAVING COUNT(*) = 2
    );
    RETURN both_popularity / SQRT(first_popularity * second_popularity);
  ELSE
    RETURN -(
      (
        SELECT embedding
        FROM wallpapers
        WHERE id = first_id
      )
      <#>
      (
        SELECT embedding
        FROM wallpapers
        WHERE id = second_id
      )
    );
  END IF;
END;
$$;

CREATE FUNCTION find_most_similar_wallpapers()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  UPDATE wallpapers AS targets
  SET most_similar_wallpapers = (
    SELECT ARRAY_AGG(ROW_TO_JSON(subquery))
    FROM (
      SELECT id, calculate_wallpaper_similarity(id, targets.id) AS similarity
      FROM wallpapers
      WHERE id != targets.id
      ORDER BY similarity DESC
      LIMIT 10
    ) AS subquery
  );
END;
$$;

SELECT cron.schedule('0 0 * * *', $$SELECT find_most_similar_wallpapers()$$);
