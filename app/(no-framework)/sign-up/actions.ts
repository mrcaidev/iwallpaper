"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

export async function signUp(_: unknown, formData: FormData) {
  const supabase = createServerSupabaseClient();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();
  const passwordConfirmation = formData.get("confirmation")!.toString();

  if (password !== passwordConfirmation) {
    return "Passwords do not match.";
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
    return error.message;
  }

  revalidatePath("/", "layout");
  redirect("/");
}
