INSERT INTO storage.buckets (id, name, allowed_mime_types) VALUES ('avatars', 'avatars', '{"image/*"}');

CREATE POLICY "Users can select their own avatar." ON storage.objects FOR SELECT USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Users can insert their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
