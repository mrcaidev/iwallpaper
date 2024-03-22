CREATE OR REPLACE FUNCTION tags_to_fts(tags TEXT[])
RETURNS TSVECTOR
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT TO_TSVECTOR('english', ARRAY_TO_STRING(tags, ' '));
$$;

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
  fts TSVECTOR GENERATED ALWAYS AS (tags_to_fts(tags)) STORED NOT NULL,
  embedding VECTOR(384) NOT NULL,
  popularity INTEGER DEFAULT 0 NOT NULL,
  most_similar_wallpapers JSONB[] DEFAULT '{}' NOT NULL
);

ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select all wallpapers." ON wallpapers FOR SELECT USING (TRUE);
