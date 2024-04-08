"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

type Reaction =
  | {
      type: "attitude";
      payload: null | "liked" | "disliked";
    }
  | {
      type: "download";
    }
  | {
      type: "rating";
      payload: number;
    };

export async function react(wallpaperId: string, reaction: Reaction) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const { error: upsertError } = await supabase.from("histories").upsert(
    {
      user_id: user.id,
      wallpaper_id: wallpaperId,
      ...(reaction.type === "attitude" ? { attitude: reaction.payload } : {}),
      ...(reaction.type === "download" ? { is_downloaded: true } : {}),
      ...(reaction.type === "rating" ? { rating: reaction.payload } : {}),
    },
    { onConflict: "user_id, wallpaper_id" },
  );

  if (upsertError) {
    return upsertError.message;
  }

  return "";
}
