"use client";

import { Masonry } from "components/masonry";
import type { Wallpaper } from "utils/types";
import { fetchFavorites } from "./actions";

type Props = {
  initialWallpapers: Wallpaper[];
};

export function FavoritesPageMasonry({ initialWallpapers }: Props) {
  return (
    <Masonry
      initialWallpapers={initialWallpapers}
      fetchWallpapers={fetchFavorites}
    />
  );
}
