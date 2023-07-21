import { Masonry } from "components/masonry";
import { useInfiniteScroll } from "hooks/use-infinite-scroll";
import mockWallpapers from "mocks/wallpapers.json";
import { useRef, useState } from "react";
import { Loader } from "react-feather";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";

export function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  const bottomRef = useRef<HTMLParagraphElement>(null);
  useInfiniteScroll(bottomRef, () => {
    recommendWallpapers().then((wallpapers) => {
      setWallpapers((prevWallpapers) => [...prevWallpapers, ...wallpapers]);
    });
  });

  return (
    <div className="mt-20 px-8 py-4">
      <Masonry wallpapers={wallpapers} />
      <p
        ref={bottomRef}
        className="flex justify-center items-center gap-2 my-8 text-slate-600 dark:text-slate-400"
      >
        <Loader size={16} className="animate-spin" />
        More wallpapers on the way...
      </p>
    </div>
  );
}

async function recommendWallpapers() {
  if (import.meta.env.DEV) {
    return mockWallpapers;
  }

  const { data, error } = await supabase.rpc("recommend_wallpapers");

  if (error) {
    toast.error(error.message);
    return [];
  }

  return snakeToCamel(data);
}
