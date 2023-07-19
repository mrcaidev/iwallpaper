import { createClient } from "@supabase/supabase-js";

interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nick_name: string;
          avatar_url: string;
        };
      };
      wallpapers: {
        Row: {
          id: string;
          thumbnail_url: string;
          raw_url: string;
          sift: string;
          tf_idf: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
      };
      categorizations: {
        Row: {
          id: string;
          wallpaper_id: string;
          tag_id: string;
        };
      };
    };
  };
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
);
