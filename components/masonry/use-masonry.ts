import { useMemo } from "react";
import type { Wallpaper } from "utils/types";
import { useColumnNumber } from "./use-column-number";

export function useMasonry(wallpapers: Wallpaper[]) {
  const columnNumber = useColumnNumber();

  const masonry = useMemo(() => {
    const masonry = Array.from(
      { length: columnNumber },
      () => [] as Wallpaper[],
    );

    const columnHeights = Array(columnNumber).fill(0);

    for (const wallpaper of wallpapers) {
      const { width, height } = wallpaper;
      const lowestIndex = columnHeights.indexOf(Math.min(...columnHeights));
      masonry[lowestIndex]!.push(wallpaper);
      columnHeights[lowestIndex] += height / width;
    }

    return masonry;
  }, [wallpapers, columnNumber]);

  return masonry;
}
