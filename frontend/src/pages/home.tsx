import { Masonry } from "components/masonry";
import { useBottomDetection } from "hooks/use-bottom-detection";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";

export function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

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
      <Masonry wallpapers={wallpapers} />
      <p
        ref={bottomRef}
        className="text-sm text-center text-slate-600 dark:text-slate-400"
      >
        Loading more wallpapers for you...
      </p>
    </>
  );
}
