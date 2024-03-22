CREATE FUNCTION update_wallpaper_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  UPDATE wallpapers
  SET popularity = popularity + (CASE WHEN NEW.is_positive = TRUE THEN 1 ELSE -1 END)
  WHERE id = NEW.wallpaper_id;
END;
$$;

CREATE TRIGGER update_wallpaper_popularity
AFTER UPDATE OF is_positive ON histories
FOR EACH ROW EXECUTE FUNCTION update_wallpaper_popularity();
