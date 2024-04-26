"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function signUp(_: unknown, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();
  const confirmPassword = formData.get("confirm-password")!.toString();

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname: null,
        avatar_url: null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
