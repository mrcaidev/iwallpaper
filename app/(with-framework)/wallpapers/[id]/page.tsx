import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { DownloadIcon, EyeOffIcon, HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { capitalize } from "utils/case";
import { createServerSupabaseClient } from "utils/supabase/server";
import { LikeButton } from "./like-button";

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
    title: capitalize(wallpaper.description),
    description: wallpaper.tags.join(", "),
  };
}

export default async function Page({ params: { id } }: Props) {
  const [wallpaper, { userId, history }] = await Promise.all([
    fetchWallpaper(id),
    fetchHistory(id),
  ]);

  if (!wallpaper) {
    return null;
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Wallpaper details
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
        <form className="grid grid-cols-2 gap-2">
          {userId ? (
            <LikeButton
              wallpaperId={wallpaper.id}
              initialIsLiked={history?.liked_at !== null}
            />
          ) : (
            <Button variant="outline" asChild>
              <Link href="/sign-in">
                <HeartIcon size={16} className="mr-2" />
                Like
              </Link>
            </Button>
          )}
          <Button variant="outline">
            <EyeOffIcon size={16} className="mr-2" />
            Hide
          </Button>
        </form>
        <div>
          <Button className="w-full">
            <DownloadIcon size={16} className="mr-2" />
            Download
          </Button>
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
    .single();

  return wallpaper;
}

async function fetchHistory(wallpaperId: string) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  if (!userId) {
    return { userId: null, history: null };
  }

  const { data: history } = await supabase
    .from("histories")
    .select("liked_at, hidden_at, rating")
    .eq("user_id", userId)
    .eq("wallpaper_id", wallpaperId)
    .maybeSingle();

  return { userId, history };
}
