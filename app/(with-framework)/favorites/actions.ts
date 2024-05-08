"use server";

import { createSupabaseServerClient } from "utils/supabase/server";

type Options = {
  take: number;
  skip: number;
};

export async function fetchFavorites({ take, skip }: Options) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("histories")
    .select(
      "attitude, wallpapers (id, pathname, description, width, height, tags)",
    )
    .eq("attitude", "liked")
    .range(skip, skip + take - 1);

  if (error) {
    return [];
  }

  const favorites = data.map((favorite) => ({
    attitude: favorite.attitude,
    ...favorite.wallpapers!,
  }));

  return favorites;
}
