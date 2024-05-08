import { PageTitle } from "components/ui/page-title";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";
import { AvatarCard } from "./avatar-card";
import { DeleteUserButton } from "./delete-user-card";
import { NicknameCard } from "./nickname-card";

export const metadata: Metadata = {
  title: "Settings",
  description: "Change your settings on iWallpaper",
};

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <PageTitle>Settings</PageTitle>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 md:gap-x-16">
        <AvatarCard initialAvatarUrl={user.user_metadata.avatar_url ?? ""} />
        <div className="grow space-y-4">
          <NicknameCard initialNickname={user.user_metadata.nickname ?? ""} />
          <DeleteUserButton />
        </div>
      </div>
    </div>
  );
}
