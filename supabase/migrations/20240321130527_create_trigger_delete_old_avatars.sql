CREATE FUNCTION delete_old_avatars()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = storage, pg_temp
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE owner = NEW.owner;
  RETURN NEW;
END;
$$;

CREATE TRIGGER delete_old_avatars
BEFORE INSERT
ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION delete_old_avatars();
