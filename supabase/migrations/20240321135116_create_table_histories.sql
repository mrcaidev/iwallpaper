CREATE TABLE histories (
  id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallpaper_id UUID NOT NULL REFERENCES wallpapers ON DELETE CASCADE,
  rating SMALLINT CHECK (rating BETWEEN 0 AND 5),
  is_positive BOOLEAN GENERATED ALWAYS AS (rating >= 3) STORED,
  liked_at TIMESTAMPTZ,
  UNIQUE (user_id, wallpaper_id)
);

ALTER TABLE histories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select all histories." ON histories FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own history." ON histories FOR UPDATE USING (auth.uid() = user_id);
