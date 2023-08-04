-- For similar user recommendation.
create index if not exists profiles_embedding_idx on profiles
using ivfflat (embedding vector_cosine_ops) with (lists = 5);

-- For similar wallpaper recommendation.
create index if not exists wallpapers_embedding_idx on wallpapers
using ivfflat (embedding vector_cosine_ops) with (lists = 5);

-- For wallpaper tag search.
create index if not exists wallpapers_document_idx on wallpapers
using gin (document);
