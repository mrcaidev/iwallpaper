import { WallpaperThumbnail } from "components/wallpaper";
import { useRef, useState } from "react";
import type { Wallpaper } from "utils/types";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { useWallpaperGroups } from "./use-wallpaper-groups";

type Props = {
  initialWallpapers: Wallpaper[];
  pageSize?: number;
  fetchWallpapers: (options: {
    take: number;
    skip: number;
  }) => Promise<Wallpaper[]>;
};

export function Masonry({
  initialWallpapers,
  pageSize = initialWallpapers.length,
  fetchWallpapers,
}: Props) {
  const [wallpapers, setWallpapers] = useState(initialWallpapers);
  const wallpaperGroups = useWallpaperGroups(wallpapers);

  const [skip, setSkip] = useState(initialWallpapers.length);

  const bottomRef = useRef<HTMLParagraphElement>(null);
  useInfiniteScroll(bottomRef, () => {
    fetchWallpapers({ take: pageSize, skip }).then((nextWallpapers) => {
      setWallpapers([...wallpapers, ...nextWallpapers]);
      setSkip((skip) => skip + pageSize);
    });
  });

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {wallpaperGroups.map((wallpapers, index) => (
          <div key={index} className="flex flex-col gap-4">
            {wallpapers.map((wallpaper) => (
              <WallpaperThumbnail key={wallpaper.id} wallpaper={wallpaper} />
            ))}
          </div>
        ))}
      </div>
      <p ref={bottomRef} className="py-4 text-center text-sm">
        You have reached the bottom...
      </p>
    </>
  );
}
