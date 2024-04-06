import { Skeleton } from "components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import type { Wallpaper } from "utils/types";

type Props = {
  wallpaper: Wallpaper;
};

export function WallpaperThumbnail({
  wallpaper: { id, pathname, description, width, height, liked_at },
}: Props) {
  return (
    <div className="relative">
      <Skeleton
        className="absolute left-0 right-0 top-0 bottom-0 -z-10"
        style={{ aspectRatio: width / height }}
      />
      <Image
        src={`https://images.unsplash.com/${pathname}?w=400`}
        width={width}
        height={height}
        alt={description}
        unoptimized
        className="rounded-md"
      />
      <Link
        href={`/wallpapers/${id}`}
        className="absolute left-0 right-0 top-0 bottom-0"
      >
        <span className="sr-only">View details of this wallpaper</span>
      </Link>
    </div>
  );
}
