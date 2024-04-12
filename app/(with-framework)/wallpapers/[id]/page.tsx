import { WallpaperDetail } from "components/wallpaper";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";

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
    <div className="p-4 lg:p-6">
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        {wallpaper.description}
      </h1>
      <WallpaperDetail wallpaper={{ ...wallpaper, ...history }} />
    </div>
  );
}

async function fetchWallpaper(id: string) {
  const supabase = createServerSupabaseClient();

  const { data: wallpaper } = await supabase
    .from("wallpapers")
    .select("id, slug, pathname, description, width, height, tags")
    .eq("id", id)
    .maybeSingle();

  return wallpaper;
}

async function fetchHistory(wallpaperId: string) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  if (!userId) {
    return null;
  }

  const { data: history } = await supabase
    .from("histories")
    .select("attitude, rating")
    .eq("user_id", userId)
    .eq("wallpaper_id", wallpaperId)
    .maybeSingle();

  return history;
}
