CREATE FUNCTION update_wallpaper_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  difference SMALLINT;
BEGIN
  IF OLD.preference IS NULL AND NEW.preference >= 3 THEN
    difference = 1;
  ELSIF OLD.preference < 3 AND NEW.preference >= 3 THEN
    difference = 1;
  ELSIF OLD.preference >= 3 AND NEW.preference IS NULL THEN
    difference = -1;
  ELSIF OLD.preference >= 3 AND NEW.preference < 3 THEN
    difference = -1;
  ELSE
    RETURN NEW;
  END IF;

  UPDATE wallpapers
  SET popularity = popularity + difference
  WHERE id = NEW.wallpaper_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_wallpaper_popularity
AFTER UPDATE OF preference ON histories
FOR EACH ROW EXECUTE FUNCTION update_wallpaper_popularity();
