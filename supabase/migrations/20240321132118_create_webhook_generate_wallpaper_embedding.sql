CREATE TRIGGER generate_wallpaper_embedding
AFTER INSERT ON wallpapers
FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request(
  'http://kong:8000/functions/v1/generate-wallpaper-embedding',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
