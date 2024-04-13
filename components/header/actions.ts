"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function signOut() {
  const supabase = createServerSupabaseClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/sign-in");
}
