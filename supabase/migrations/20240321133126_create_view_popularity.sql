CREATE VIEW popularities AS (
  SELECT wallpaper_id AS id, COUNT(*) AS popularity
  FROM histories
  WHERE preference >= 3
  GROUP BY wallpaper_id
);
