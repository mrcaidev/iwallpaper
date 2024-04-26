import { Skeleton } from "components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import type { Wallpaper } from "utils/types";
import { AttitudeButtonGroup } from "./attitude-button-group";

type Props = {
  wallpaper: Wallpaper;
};

export function WallpaperThumbnail({ wallpaper }: Props) {
  const imgSrc = new URL(wallpaper.pathname, "https://images.unsplash.com");
  imgSrc.searchParams.set("w", "400");

  return (
    <div className="group relative">
      <Skeleton
        className="absolute left-0 right-0 top-0 bottom-0 -z-10"
        style={{ aspectRatio: wallpaper.width / wallpaper.height }}
      />
      <Image
        src={imgSrc.toString()}
        width={wallpaper.width}
        height={wallpaper.height}
        alt={wallpaper.description}
        unoptimized
        className="rounded-md"
      />
      <Link
        href={`/wallpapers/${wallpaper.id}`}
        className="absolute left-0 right-0 top-0 bottom-0"
      >
        <span className="sr-only">View details of this wallpaper</span>
      </Link>
      <div className="hidden group-hover:block absolute top-2 right-2">
        <AttitudeButtonGroup
          wallpaperId={wallpaper.id}
          initialAttitude={wallpaper.attitude ?? null}
        />
      </div>
    </div>
  );
}
