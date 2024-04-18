import { Skeleton } from "components/ui/skeleton";
import Image from "next/image";
import type { Wallpaper } from "utils/types";
import { DetailAttitudeButtonGroup } from "./attitude-button-group";
import { DownloadButton } from "./download-button";
import { Rating } from "./rating";

type Props = {
  wallpaper: Wallpaper;
};

export function WallpaperDetail({ wallpaper }: Props) {
  const imgSrc = new URL(wallpaper.pathname, "https://images.unsplash.com");
  imgSrc.searchParams.set("w", "1080");

  return (
    <div>
      <div className="relative max-w-[1000px] mx-auto mb-3 lg:mb-4">
        <Skeleton
          className="absolute top-0 left-0 w-full -z-10"
          style={{ aspectRatio: wallpaper.width / wallpaper.height }}
        />
        <Image
          src={imgSrc.toString()}
          width={wallpaper.width}
          height={wallpaper.height}
          alt={wallpaper.description}
          priority
          unoptimized
          className="object-contain"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <DetailAttitudeButtonGroup
          wallpaperId={wallpaper.id}
          initialAttitude={wallpaper.attitude ?? null}
        />
        <div>
          <Rating
            wallpaperId={wallpaper.id}
            initialRating={wallpaper.rating ?? null}
          />
        </div>
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
