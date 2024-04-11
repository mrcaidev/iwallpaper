"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

type Options = {
  take?: number;
  skip?: number;
};

export async function fetchFavorites({ take = 30, skip = 0 }: Options) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Unauthenticated users would have already been redirected using middleware.
    // So it's safe to return anything here,
    // as logically this code should never be reached.
    return [];
  }

  const { data, error: selectError } = await supabase
    .from("wallpapers")
    .select("id, slug, pathname, description, width, height, tags")
    .eq("histories.user_id", user.id)
    .eq("histories.attitude", "liked")
    .range(skip, skip + take - 1);

  if (selectError) {
    return [];
  }

  const favorites = data.map((favorite) => ({
    ...favorite,
    attitude: "liked" as const,
  }));

  return favorites;
}
