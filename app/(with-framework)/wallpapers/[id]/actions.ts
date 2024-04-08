"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

type Reaction =
  | {
      type: "normal" | "like" | "hide" | "download";
    }
  | {
      type: "rate";
      payload: number;
    };

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
      ...getLikedAt(reaction),
      ...getHiddenAt(reaction),
      ...getDownloadedAt(reaction),
      ...getRating(reaction),
    },
    { onConflict: "user_id, wallpaper_id" },
  );

  if (upsertError) {
    return upsertError.message;
  }

  return "";
}

function getLikedAt(reaction: Reaction) {
  switch (reaction.type) {
    case "like":
      return { liked_at: new Date().toISOString() };
    case "normal":
    case "hide":
      return { liked_at: null };
    default:
      return {};
  }
}

function getHiddenAt(reaction: Reaction) {
  switch (reaction.type) {
    case "hide":
      return { hidden_at: new Date().toISOString() };
    case "normal":
    case "like":
      return { hidden_at: null };
    default:
      return {};
  }
}

function getDownloadedAt(reaction: Reaction) {
  switch (reaction.type) {
    case "download":
      return { downloaded_at: new Date().toISOString() };
    default:
      return {};
  }
}

function getRating(reaction: Reaction) {
  switch (reaction.type) {
    case "rate":
      return { rating: reaction.payload };
    default:
      return {};
  }
}
