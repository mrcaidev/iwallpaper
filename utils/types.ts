import type { Database } from "./supabase/types";

export type Wallpaper = Pick<
  Database["public"]["Tables"]["wallpapers"]["Row"],
  "id" | "pathname" | "description" | "width" | "height" | "tags"
> &
  Partial<
    Pick<
      Database["public"]["Tables"]["histories"]["Row"],
      "attitude" | "rating"
    >
  >;
