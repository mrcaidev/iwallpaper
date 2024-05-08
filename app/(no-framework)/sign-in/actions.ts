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

export async function signInWithGithub(_: unknown) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: process.env.ORIGIN + "/auth/callback",
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
