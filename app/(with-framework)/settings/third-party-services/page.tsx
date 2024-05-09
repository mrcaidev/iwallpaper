import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";
import { LinkIdentitiesCard } from "./link-identities-card";

export const metadata: Metadata = {
  title: "Third-party services",
  description: "Link third party services to the iWallpaper platform",
};

export default async function SettingsThirdPartyServicesPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-4">
      <LinkIdentitiesCard initialIdentities={data.identities} />
    </div>
  );
}
