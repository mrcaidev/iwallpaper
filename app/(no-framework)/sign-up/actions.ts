"use server";

import { createSupabaseServerClient } from "utils/supabase/server";

export async function signUp(_: unknown, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();
  const confirmPassword = formData.get("confirm-password")!.toString();

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: "" };
}
