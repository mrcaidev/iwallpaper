import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { DownloadIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
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
  const wallpaper = await fetchWallpaper(id);

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
          <LikeButton wallpaperId={wallpaper.id} />
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

  const { data: wallpaper, error } = await supabase
    .from("wallpapers")
    .select("id, slug, pathname, description, width, height, tags")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return wallpaper;
}
