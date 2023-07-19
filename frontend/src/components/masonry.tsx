import { useState } from "react";
import { Wallpaper } from "utils/types";
import { WallpaperThumbnail } from "./wallpaper/thumbnail";

const exampleWallpapers = [
  {
    id: "1",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1689265908194-fed7d4896836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://images.unsplash.com/photo-1689265908194-fed7d4896836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
  {
    id: "2",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1682687219612-b12805df750d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://images.unsplash.com/photo-1682687219612-b12805df750d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
  {
    id: "3",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1689351060804-fca36e095da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://images.unsplash.com/photo-1689351060804-fca36e095da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
  {
    id: "4",
    thumbnailUrl:
      "https://plus.unsplash.com/premium_photo-1688700437975-0ea63cfa59e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://plus.unsplash.com/premium_photo-1688700437975-0ea63cfa59e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
  {
    id: "5",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1689240639845-037ff7f885db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://images.unsplash.com/photo-1689240639845-037ff7f885db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
  {
    id: "6",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1689196249228-3054e22aefe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=60",
    rawUrl:
      "https://images.unsplash.com/photo-1689196249228-3054e22aefe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=60",
    tags: ["starry sky", "beach", "hd wallpaper", "tree images & pictures"],
  },
];

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
