CREATE FUNCTION delete_unused_avatars()
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER SET search_path = storage, pg_temp
AS $$
DELETE FROM storage.objects o
WHERE o.created_at < (
    SELECT MAX(created_at)
    FROM storage.objects
    WHERE owner = o.owner
);
$$;

SELECT cron.schedule('0 0 * * *', $$SELECT delete_unused_avatars()$$);
