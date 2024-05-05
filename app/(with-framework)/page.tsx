import { PageTitle } from "components/ui/page-title";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";
import { fetchRecommendations } from "./actions";
import { HomePageMasonry } from "./masonry";

export const metadata: Metadata = {
  title: "iWallpaper - Wallpaper Exploring Platform",
};

type Props = {
  searchParams: {
    code?: string;
  };
};

export default async function HomePage({ searchParams: { code } }: Props) {
  if (code) {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session", error);
      return;
    }

    console.log(data);

    revalidatePath("/", "layout");
    redirect("/");
  }

  const initialWallpapers = await fetchRecommendations({ take: 30 });

  return (
    <div>
      <PageTitle>Recommended for you</PageTitle>
      <HomePageMasonry initialWallpapers={initialWallpapers} />
    </div>
  );
}
