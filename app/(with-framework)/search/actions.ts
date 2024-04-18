"use server";

import { createServerSupabaseClient } from "utils/supabase/server";
import type { Wallpaper } from "utils/types";

type Options = {
  take: number;
  skip: number;
};

export async function search(query: string, { take, skip }: Options) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.functions.invoke(
    encodeURI(`search-wallpapers?query=${query}&take=${take}&skip=${skip}`),
  );

  if (error) {
    return [];
  }

  return data as Wallpaper[];
}
