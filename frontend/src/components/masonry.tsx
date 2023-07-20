import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";
import { WallpaperThumbnail } from "./wallpaper/thumbnail";

export function Masonry() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const masonry = useMasonry(wallpapers);

  const bottomRef = useRef<HTMLParagraphElement>(null);
  useBottomDetection(bottomRef, () => {
    supabase.rpc("recommend_wallpapers").then(({ data, error }) => {
      if (error) {
        toast.error(error.message);
        return;
      }

      const newWallpapers = snakeToCamel(data);
      setWallpapers((wallpapers) => [...wallpapers, ...newWallpapers]);
    });
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {masonry.map((wallpapers, index) => (
          <div key={index} className="flex flex-col gap-4">
            {wallpapers.map((wallpaper) => (
              <WallpaperThumbnail key={wallpaper.id} wallpaper={wallpaper} />
            ))}
          </div>
        ))}
      </div>
      <p ref={bottomRef} className="sr-only">
        You have scrolled to the bottom of the page. Please wait for new
        wallpapers to load.
      </p>
    </>
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

function useBottomDetection(
  bottomRef: RefObject<HTMLElement>,
  callback: () => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const bottom = bottomRef.current;

    if (!bottom) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(bottom);
    return () => observer.unobserve(bottom);
  }, [bottomRef]);
}
