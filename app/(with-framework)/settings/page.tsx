import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";
import { AvatarCard } from "./avatar-card";
import { DeleteUserButton } from "./delete-user-card";
import { NicknameCard } from "./nickname-card";

export const metadata: Metadata = {
  title: "Settings",
  description: "Change your settings on iWallpaper",
};

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Settings
      </h1>
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-x-16">
        <AvatarCard initialAvatarPath={user.user_metadata.avatar_path} />
        <div className="grow space-y-4">
          <NicknameCard initialNickname={user.user_metadata.nickname ?? ""} />
          <DeleteUserButton />
        </div>
      </div>
    </div>
  );
}
