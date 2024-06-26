"use client";

import { Masonry } from "components/masonry";
import type { Wallpaper } from "utils/types";
import { search } from "./actions";

type Props = {
  query: string;
  initialWallpapers: Wallpaper[];
};

export function SearchPageMasonry({ query, initialWallpapers }: Props) {
  return (
    <Masonry
      initialWallpapers={initialWallpapers}
      fetchWallpapers={search.bind(null, query)}
    />
  );
}
