import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";
import { AvatarCard } from "./avatar-card";

export const metadata: Metadata = {
  title: "Settings",
  description: "Change your settings on iWallpaper",
};

export default async function SettingPage() {
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
      <div className="flex flex-col sm:flex-row gap-4">
        <AvatarCard initialAvatarPath={user.user_metadata.avatar_path} />
      </div>
    </div>
  );
}
