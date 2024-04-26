import { Skeleton } from "components/ui/skeleton";
import { cn } from "components/ui/utils";
import Image from "next/image";
import Link from "next/link";
import type { Wallpaper } from "utils/types";
import { AttitudeButtonGroup } from "./attitude-button-group";
import { DownloadButton } from "./download-button";
import { Rating } from "./rating";

type Props = {
  wallpaper: Wallpaper;
};

export function WallpaperDetail({ wallpaper }: Props) {
  const imgSrc = new URL(wallpaper.pathname, "https://images.unsplash.com");
  imgSrc.searchParams.set("w", "1080");

  const isVertical = wallpaper.height > wallpaper.width;

  return (
    <div
      className={cn(
        "flex gap-6",
        isVertical
          ? "flex-row flex-wrap justify-evenly"
          : "flex-col items-center",
      )}
    >
      <div className="relative">
        <Skeleton className="absolute left-0 right-0 top-0 bottom-0 -z-10" />
        <Image
          src={imgSrc.toString()}
          width={wallpaper.width}
          height={wallpaper.height}
          alt={wallpaper.description}
          priority
          unoptimized
          className="object-contain w-fit max-h-[640px] rounded-md"
        />
      </div>
      <div
        className={cn(
          "flex flex-col gap-3",
          isVertical ? "max-w-[480px]" : "max-w-[1080px]",
        )}
      >
        <h2 className="md:text-lg font-semibold">Description</h2>
        <p className="md:text-lg text-muted-foreground">
          {wallpaper.description}
        </p>
        <h2 className="md:text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-3">
          {wallpaper.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?query=${tag}`}
              className="text-sm md:text-base text-muted-foreground hover:text-foreground underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="grow"></div>
        <div className="self-center flex items-center gap-3">
          <DownloadButton
            wallpaperId={wallpaper.id}
            pathname={wallpaper.pathname}
          />
          <AttitudeButtonGroup
            wallpaperId={wallpaper.id}
            initialAttitude={wallpaper.attitude ?? null}
          />
          <Rating
            wallpaperId={wallpaper.id}
            initialRating={wallpaper.rating ?? null}
          />
        </div>
      </div>
    </div>
  );
}
