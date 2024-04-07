"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

type Reaction = "normal" | "like" | "hide";

export async function react(wallpaperId: string, reaction: Reaction) {
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
      rating: convertReactionToRating(reaction),
      liked_at: reaction === "like" ? new Date().toISOString() : null,
    },
    { onConflict: "user_id, wallpaper_id" },
  );

  if (upsertError) {
    return upsertError.message;
  }

  return "";
}

function convertReactionToRating(reaction: Reaction) {
  switch (reaction) {
    case "normal":
      return null;
    case "like":
      return 4;
    case "hide":
      return 1;
  }
}
