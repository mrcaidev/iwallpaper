import { Skeleton } from "components/ui/skeleton";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "utils/supabase/server";
import { AttitudeButtonGroup } from "./attitude-button-group";
import { DownloadButton } from "./download-button";

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
      <div className="relative max-w-[1000px] mx-auto mb-3 lg:mb-4">
        <Skeleton
          className="absolute top-0 left-0 w-full -z-10"
          style={{ aspectRatio: wallpaper.width / wallpaper.height }}
        />
        <Image
          src={`https://images.unsplash.com/${wallpaper.pathname}?w=1080`}
          width={wallpaper.width}
          height={wallpaper.height}
          alt={wallpaper.description}
          priority
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <AttitudeButtonGroup
          wallpaperId={wallpaper.id}
          initialAttitude={history?.attitude ?? null}
        />
        <div>
          <DownloadButton
            wallpaperId={wallpaper.id}
            pathname={wallpaper.pathname}
          />
        </div>
      </div>
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
    .select("attitude")
    .eq("user_id", userId)
    .eq("wallpaper_id", wallpaperId)
    .maybeSingle();

  return history;
}
