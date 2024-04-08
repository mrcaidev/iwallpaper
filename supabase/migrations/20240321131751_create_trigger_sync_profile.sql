CREATE FUNCTION auth.sync_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO profiles (id, nickname, avatar_url) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'avatar_url'
    );

  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE profiles
    SET nickname = NEW.raw_user_meta_data->>'nickname',
        avatar_url = NEW.raw_user_meta_data->>'avatar_url'
    WHERE id = NEW.id;

  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_profile
AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW EXECUTE FUNCTION auth.sync_profile();
