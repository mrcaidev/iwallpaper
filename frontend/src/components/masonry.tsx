import { useState } from "react";
import { Wallpaper } from "utils/types";
import exampleWallpapers from "./example-wallpapers.json";
import { WallpaperThumbnail } from "./wallpaper/thumbnail";

export function Masonry() {
  const [wallpapers] = useState<Wallpaper[]>(exampleWallpapers);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
      {wallpapers.map((wallpaper) => (
        <WallpaperThumbnail key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
}
