CREATE FUNCTION should_use_embedding(first_id UUID, second_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
SELECT COUNT(*) < GREATEST(3, 0.1 * (SELECT COUNT(*) FROM auth.users))
FROM (
  SELECT COUNT(*)
  FROM histories
  WHERE wallpaper_id IN (first_id, second_id)
    AND preference IS NOT NULL
  GROUP BY user_id
  HAVING COUNT(*) = 2
) AS subquery
$$;

CREATE FUNCTION vectorize_wallpaper_histories(target_id UUID)
RETURNS VECTOR
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
SELECT ARRAY_AGG(COALESCE(histories.preference, 0))::VECTOR
FROM auth.users
LEFT OUTER JOIN histories ON (
  histories.user_id = auth.users.id AND histories.wallpaper_id = target_id
);
$$;

CREATE FUNCTION calculate_wallpaper_similarity(first_id UUID, second_id UUID)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  IF should_use_embedding(first_id, second_id) THEN
    RETURN -(
      (SELECT embedding FROM wallpapers WHERE id = first_id)
      <#>
      (SELECT embedding FROM wallpapers WHERE id = second_id)
    );
  ELSE
    RETURN (
      vectorize_wallpaper_histories(first_id)
      <=>
      vectorize_wallpaper_histories(second_id)
    );
  END IF;
END;
$$;

CREATE FUNCTION update_most_similar_wallpapers()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
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
)
WHERE most_similar_wallpapers = '{}';
$$;

SELECT cron.schedule('0 0 * * *', $$SELECT update_most_similar_wallpapers()$$);
