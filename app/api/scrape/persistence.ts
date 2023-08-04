import { supabaseServer } from "supabase/server";
import { Database } from "supabase/types";

type Row = Database["public"]["Tables"]["wallpapers"]["Insert"];

export async function upsert(wallpapers: Row[]) {
  const { count, error } = await supabaseServer
    .from("wallpapers")
    .upsert(wallpapers, {
      count: "exact",
      onConflict: "slug",
      ignoreDuplicates: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return count;
}
