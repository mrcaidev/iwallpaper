import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";
import { AvatarCard } from "./avatar-card";
import { NicknameCard } from "./nickname-card";

export const metadata: Metadata = {
  title: "Profile",
  description: "Change your profile on the iWallpaper platform",
};

export default async function SettingsProfilePage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-4">
      <AvatarCard initialAvatarUrl={user.user_metadata.avatar_url} />
      <NicknameCard
        initialNickname={
          user.user_metadata.nickname ??
          user.user_metadata.full_name ??
          user.user_metadata.user_name ??
          ""
        }
      />
    </div>
  );
}
