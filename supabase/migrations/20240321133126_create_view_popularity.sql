CREATE VIEW popularities AS (
  SELECT wallpapers.id, COUNT(*) AS popularity
  FROM histories
  LEFT OUTER JOIN wallpapers ON histories.wallpaper_id = wallpapers.id
  WHERE histories.preference >= 3
  GROUP BY wallpapers.id
);
