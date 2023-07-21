import { Masonry } from "components/masonry";
import { useBottomDetection } from "hooks/use-bottom-detection";
import mockWallpapers from "mock/wallpapers.json";
import { useRef, useState } from "react";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";

export function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useBottomDetection(bottomRef, () => {
    if (import.meta.env.DEV) {
      setWallpapers((wallpapers) => [...wallpapers, ...mockWallpapers]);
      return;
    }

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
      <Masonry wallpapers={wallpapers} />
      <div
        ref={bottomRef}
        className="flex justify-center items-center gap-2 my-8 text-slate-600 dark:text-slate-400"
      >
        <Loader size={16} className="animate-spin" />
        More wallpapers on the way...
      </div>
    </>
  );
}
