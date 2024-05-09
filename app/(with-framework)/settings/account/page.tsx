import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";
import { DeleteUserCard } from "./delete-user-card";

export const metadata: Metadata = {
  title: "Account",
  description: "Change your account settings the iWallpaper platform",
};

export default async function SettingsAccountPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-4">
      <DeleteUserCard />
    </div>
  );
}
