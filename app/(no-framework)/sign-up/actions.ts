"use server";

import { createSupabaseServerClient } from "utils/supabase/server";

type SignUpState = {
  sentEmailCount: number;
  error: string;
};

export async function signUp(state: SignUpState, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();
  const confirmPassword = formData.get("confirm-password")!.toString();

  if (password !== confirmPassword) {
    return { ...state, error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { ...state, error: error.message };
  }

  const nextSentEmailCount = state.sentEmailCount + 1;
  return { ...state, sentEmailCount: nextSentEmailCount, error: "" };
}
