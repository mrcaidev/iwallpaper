"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

export async function signIn(_: unknown, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
