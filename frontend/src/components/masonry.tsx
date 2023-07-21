import { useEffect, useMemo, useState } from "react";
import { Wallpaper } from "utils/types";
import { WallpaperThumbnail } from "./wallpaper/thumbnail";

type Props = {
  wallpapers: Wallpaper[];
};

export function Masonry({ wallpapers }: Props) {
  const masonry = useMasonry(wallpapers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {masonry.map((wallpapers, index) => (
        <div key={index} className="flex flex-col gap-4">
          {wallpapers.map((wallpaper, index) => (
            <WallpaperThumbnail
              key={wallpaper.id + index}
              wallpaper={wallpaper}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function useMasonry(wallpapers: Wallpaper[]) {
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

function useColumnNumber() {
  const [columnNumber, setColumnNumber] = useState(getColumnNumber());

  useEffect(() => {
    const handleResize = () => {
      setColumnNumber(getColumnNumber());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columnNumber;
}

function getColumnNumber() {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.innerWidth < 640) {
    return 1;
  }

  if (window.innerWidth < 1024) {
    return 2;
  }

  return 3;
}
