"use server";

import { createSupabaseServerClient } from "utils/supabase/server";

type UpdateNicknameState = {
  nickname: string;
  error: string;
};

export async function updateNickname(
  state: UpdateNicknameState,
  formData: FormData,
) {
  const supabase = createSupabaseServerClient();

  const nickname = formData.get("nickname")!.toString();

  const { error } = await supabase.auth.updateUser({ data: { nickname } });

  if (error) {
    return { ...state, error: error.message };
  }

  return { nickname, error: "" };
}
