CREATE FUNCTION update_wallpaper_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  old_is_positive BOOLEAN;
  new_is_positive BOOLEAN;
BEGIN
  old_is_positive = OLD.preference >= 3;
  new_is_positive = NEW.preference >= 3;

  IF old_is_positive = new_is_positive THEN
    RETURN NEW;
  END IF;

  UPDATE wallpapers
  SET popularity = popularity + (CASE WHEN new_is_positive = TRUE THEN 1 ELSE -1 END)
  WHERE id = NEW.wallpaper_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_wallpaper_popularity
AFTER UPDATE OF preference ON histories
FOR EACH ROW EXECUTE FUNCTION update_wallpaper_popularity();
