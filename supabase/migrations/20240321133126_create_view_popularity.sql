CREATE VIEW popularities AS (
  SELECT wallpapers.id, (
    SELECT COUNT(histories.user_id)
    FROM histories
    WHERE histories.wallpaper_id = wallpapers.id
      AND histories.preference >= 3
  ) AS popularity
  FROM wallpapers
);
