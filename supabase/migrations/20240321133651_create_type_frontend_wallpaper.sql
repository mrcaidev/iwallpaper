CREATE TYPE frontend_wallpaper AS (
  id UUID,
  slug TEXT,
  pathname TEXT,
  description TEXT,
  width INTEGER,
  height INTEGER,
  tags TEXT[],
  liked_at TIMESTAMPTZ
);
