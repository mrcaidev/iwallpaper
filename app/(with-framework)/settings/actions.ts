"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

type UpdateNicknameState = {
  nickname: string;
  error: string;
};

export async function updateNickname(
  state: UpdateNicknameState,
  formData: FormData,
) {
  const supabase = createServerSupabaseClient();

  const nickname = formData.get("nickname")!.toString();

  const { error } = await supabase.auth.updateUser({ data: { nickname } });

  if (error) {
    return { ...state, error: error.message };
  }

  return { nickname, error: "" };
}

export async function deleteUser() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not signed in" };
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    user.id,
    true,
  );

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
