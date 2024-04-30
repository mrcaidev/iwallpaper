INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, '{"image/*"}');

CREATE POLICY "Users can insert their own avatar."
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars');
