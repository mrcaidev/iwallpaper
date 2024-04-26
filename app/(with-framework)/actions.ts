"use server";

import { createServerSupabaseClient } from "utils/supabase/server";
import type { Wallpaper } from "utils/types";

type Options = {
  take: number;
};

export async function fetchRecommendations({ take }: Options) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.rpc("recommend_wallpapers", { take });

  if (error) {
    return [];
  }

  return data as Wallpaper[];
}
