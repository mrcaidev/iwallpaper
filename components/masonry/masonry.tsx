"use client";

import { WallpaperThumbnail } from "components/wallpaper";
import type { Wallpaper } from "utils/types";
import { useMasonry } from "./use-masonry";

type Props = {
  wallpapers: Wallpaper[];
};

export function Masonry({ wallpapers }: Props) {
  const masonry = useMasonry(wallpapers);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {masonry.map((wallpapers, index) => (
        <div key={index} className="flex flex-col gap-4">
          {wallpapers.map((wallpaper) => (
            <WallpaperThumbnail key={wallpaper.id} wallpaper={wallpaper} />
          ))}
        </div>
      ))}
    </div>
  );
}
