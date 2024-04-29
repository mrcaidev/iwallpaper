CREATE FUNCTION tags_to_fts(tags TEXT[])
RETURNS TSVECTOR
LANGUAGE sql
IMMUTABLE
AS $$
SELECT TO_TSVECTOR('english', ARRAY_TO_STRING(tags, ' '));
$$;

CREATE TABLE wallpapers (
  id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  pathname TEXT NOT NULL,
  description TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  tags TEXT[] NOT NULL,
  fts TSVECTOR GENERATED ALWAYS AS (tags_to_fts(tags)) STORED NOT NULL,
  embedding VECTOR(384) NOT NULL,
  most_similar_wallpapers JSONB[] DEFAULT '{}' NOT NULL
);

CREATE INDEX ON wallpapers
USING GIN (fts);

CREATE INDEX ON wallpapers
USING HNSW (embedding vector_ip_ops);

ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select all wallpapers."
ON wallpapers
FOR SELECT
USING (TRUE);
