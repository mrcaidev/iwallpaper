"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

export async function deleteUser() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not signed in" };
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    return { error: signOutError.message };
  }

  revalidatePath("/", "layout");
  redirect("/sign-in");
}
