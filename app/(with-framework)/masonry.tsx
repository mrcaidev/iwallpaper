"use client";

import { Masonry } from "components/masonry";
import type { Wallpaper } from "utils/types";

type Props = {
  initialWallpapers: Wallpaper[];
};

export function HomePageMasonry({ initialWallpapers }: Props) {
  return (
    <Masonry
      initialWallpapers={initialWallpapers}
      fetchWallpapers={async () => []}
    />
  );
}
