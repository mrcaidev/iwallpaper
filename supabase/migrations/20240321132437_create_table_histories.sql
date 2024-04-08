CREATE TABLE histories (
  id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallpaper_id UUID NOT NULL REFERENCES wallpapers ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  liked_at TIMESTAMPTZ,
  hidden_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  rating SMALLINT CHECK (rating BETWEEN 0 AND 5),
  preference SMALLINT GENERATED ALWAYS AS (
    CASE
      WHEN rating IS NOT NULL THEN rating
      WHEN hidden_at IS NOT NULL THEN 0
      WHEN downloaded_at IS NOT NULL THEN 5
      WHEN liked_at IS NOT NULL THEN 4
      ELSE NULL
    END
  ) STORED,
  UNIQUE (user_id, wallpaper_id),
  CHECK (liked_at IS NULL OR hidden_at IS NULL)
);

ALTER TABLE histories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select all histories." ON histories FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own history." ON histories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own history." ON histories FOR UPDATE USING (auth.uid() = user_id);
