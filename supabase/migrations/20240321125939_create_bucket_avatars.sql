INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, 1024 * 1024, '{"image/*"}');

CREATE POLICY "Users can insert their own avatar."
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars');
