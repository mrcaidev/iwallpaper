CREATE TABLE wallpapers (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  raw_url TEXT NOT NULL,
  regular_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  tags TEXT[] NOT NULL,
  embedding VECTOR(384) NOT NULL,
  popularity INTEGER DEFAULT 0 NOT NULL,
  most_similar_wallpapers JSONB[] DEFAULT '{}' NOT NULL
);

ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select all wallpapers." ON wallpapers FOR SELECT USING (TRUE);
