CREATE TYPE ATTITUDE AS ENUM ('liked', 'disliked');

CREATE TABLE histories (
  id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallpaper_id UUID NOT NULL REFERENCES wallpapers ON DELETE CASCADE,
  attitude ATTITUDE,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  is_downloaded BOOLEAN DEFAULT FALSE NOT NULL,
  preference SMALLINT GENERATED ALWAYS AS (
    CASE
      WHEN rating IS NOT NULL THEN rating
      WHEN attitude = 'disliked' THEN 1
      WHEN is_downloaded THEN 5
      WHEN attitude = 'liked' THEN 4
      ELSE NULL
    END
  ) STORED,
  UNIQUE (user_id, wallpaper_id)
);

ALTER TABLE histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own history."
ON histories
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history."
ON histories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history."
ON histories
FOR UPDATE
USING (auth.uid() = user_id);
