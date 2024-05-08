import { PageTitle } from "components/ui/page-title";
import { WallpaperDetail } from "components/wallpaper";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "utils/supabase/server";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params: { id } }: Props) {
  const wallpaper = await fetchWallpaper(id);

  if (!wallpaper) {
    return { title: "Error" };
  }

  return {
    title: wallpaper.description,
    description: wallpaper.tags.join(", "),
  };
}

export default async function WallpaperPage({ params: { id } }: Props) {
  const [wallpaper, history] = await Promise.all([
    fetchWallpaper(id),
    fetchHistory(id),
  ]);

  if (!wallpaper) {
    notFound();
  }

  return (
    <div>
      <PageTitle>Wallpaper detail</PageTitle>
      <WallpaperDetail wallpaper={{ ...wallpaper, ...history }} />
    </div>
  );
}

async function fetchWallpaper(id: string) {
  const supabase = createSupabaseServerClient();

  const { data: wallpaper } = await supabase
    .from("wallpapers")
    .select("id, pathname, description, width, height, tags")
    .eq("id", id)
    .maybeSingle();

  return wallpaper;
}

async function fetchHistory(wallpaperId: string) {
  const supabase = createSupabaseServerClient();

  const { data: history } = await supabase
    .from("histories")
    .select("attitude, rating")
    .eq("wallpaper_id", wallpaperId)
    .maybeSingle();

  return history;
}
