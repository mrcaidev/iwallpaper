import { useMemo } from "react";
import type { Wallpaper } from "utils/types";
import { useColumnNumber } from "./use-column-number";

export function useWallpaperGroups(wallpapers: Wallpaper[]) {
  const columnNumber = useColumnNumber();

  const wallpaperGroups = useMemo(() => {
    const groups = Array.from(
      { length: columnNumber },
      () => [] as Wallpaper[],
    );

    const columnHeights = Array(columnNumber).fill(0);

    for (const wallpaper of wallpapers) {
      const { width, height } = wallpaper;
      const lowestIndex = columnHeights.indexOf(Math.min(...columnHeights));
      groups[lowestIndex]!.push(wallpaper);
      columnHeights[lowestIndex] += height / width;
    }

    return groups;
  }, [wallpapers, columnNumber]);

  return wallpaperGroups;
}
