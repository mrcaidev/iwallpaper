"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

type UpsertHistoryPayload = {
  wallpaper_id: string;
  attitude?: "liked" | "disliked" | null;
  is_downloaded?: boolean;
  rating?: number;
};

export async function upsertHistory(payload: UpsertHistoryPayload) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { error } = await supabase
    .from("histories")
    .upsert(
      { ...payload, user_id: user.id },
      { onConflict: "user_id, wallpaper_id" },
    );

  if (error) {
    return { error: error.message };
  }

  return { error: "" };
}

type UpsertAttitudeState = {
  attitude: "liked" | "disliked" | null;
  error: string;
};

export async function upsertAttitude(
  wallpaperId: string,
  state: UpsertAttitudeState,
  event: "like" | "dislike",
): Promise<UpsertAttitudeState> {
  const getNextAttitude = () => {
    if (state.attitude === "liked" && event === "like") {
      return null;
    }
    if (state.attitude === "disliked" && event === "dislike") {
      return null;
    }
    return event === "like" ? "liked" : "disliked";
  };

  const attitude = getNextAttitude();

  const { error } = await upsertHistory({
    wallpaper_id: wallpaperId,
    attitude,
  });

  if (error) {
    return { ...state, error };
  }

  return { ...state, attitude, error: "" };
}

type UpsertRatingState = {
  rating: number;
  error: string;
};

export async function upsertRating(
  wallpaperId: string,
  state: UpsertRatingState,
  rating: number,
) {
  const { error } = await upsertHistory({
    wallpaper_id: wallpaperId,
    rating,
  });

  if (error) {
    return { ...state, error };
  }

  return { ...state, rating, error: "" };
}
