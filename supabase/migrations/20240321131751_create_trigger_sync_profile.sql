CREATE FUNCTION auth.sync_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
END;
$$;

CREATE TRIGGER sync_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION auth.sync_profile();
