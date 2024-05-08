"use server";

import { createSupabaseServerClient } from "utils/supabase/server";
import type { Wallpaper } from "utils/types";

type Options = {
  take: number;
};

export async function fetchRecommendations({ take }: Options) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.rpc("recommend_wallpapers", { take });

  if (error) {
    return [];
  }

  return data as Wallpaper[];
}
