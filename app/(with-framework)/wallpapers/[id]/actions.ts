"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

export async function like(wallpaperId: string, isLiked: boolean) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return authError.message;
  }

  if (!user) {
    return "User not found";
  }

  const { error: upsertError } = await supabase.from("histories").upsert(
    {
      user_id: user.id,
      wallpaper_id: wallpaperId,
      rating: 4,
      liked_at: isLiked ? new Date().toISOString() : null,
    },
    { onConflict: "user_id, wallpaper_id" },
  );

  if (upsertError) {
    return upsertError.message;
  }

  return "";
}
