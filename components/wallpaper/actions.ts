"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";
import type { Database } from "utils/supabase/types";

async function updateHistory(
  wallpaperId: string,
  upsertContent: Database["public"]["Tables"]["histories"]["Update"],
) {
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
      ...upsertContent,
    },
    { onConflict: "user_id, wallpaper_id" },
  );

  if (upsertError) {
    return upsertError.message;
  }

  return "";
}

export async function updateAttitude(
  wallpaperId: string,
  attitude: Database["public"]["Tables"]["histories"]["Row"]["attitude"],
) {
  return await updateHistory(wallpaperId, { attitude });
}

export async function updateIsDownloaded(wallpaperId: string) {
  return await updateHistory(wallpaperId, { is_downloaded: true });
}

export async function updateRating(
  wallpaperId: string,
  rating: Database["public"]["Tables"]["histories"]["Row"]["rating"],
) {
  return await updateHistory(wallpaperId, { rating });
}
