import type { Database } from "./supabase/types";

export type Wallpaper = {
  id: string;
  slug: string;
  pathname: string;
  description: string;
  width: number;
  height: number;
  tags: string[];
  attitude: Database["public"]["Enums"]["attitude"];
};
