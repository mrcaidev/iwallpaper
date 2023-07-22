import { AuthGuard } from "components/guards";
import { Masonry } from "components/masonry";
import { useUser } from "contexts/user";
import { useInfiniteScroll } from "hooks/use-infinite-scroll";
import { useTitle } from "hooks/use-title";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";
import { Wallpaper } from "utils/types";

export function Page() {
  useTitle("Likes");

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  const user = useUser();

  const bottomRef = useRef<HTMLParagraphElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (!user) {
      return;
    }

    fetchLikedWallpapers(user.id, wallpapers.length).then((wallpapers) => {
      setWallpapers((prevWallpapers) => [...prevWallpapers, ...wallpapers]);
    });
  });

  return (
    <AuthGuard>
      <div className="mt-20 px-8 py-4">
        <h1 className="mb-8 font-bold text-2xl">Liked wallpapers</h1>
        <Masonry wallpapers={wallpapers} />
        <p ref={bottomRef} className="my-8 text-center">
          <Link
            to="/"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors underline underline-offset-4"
          >
            {wallpapers.length === 0
              ? "Go like some wallpapers and come back!"
              : "Find more wallpapers you like!"}
          </Link>
        </p>
      </div>
    </AuthGuard>
  );
}

async function fetchLikedWallpapers(userId: string, offset = 0) {
  const { data, error } = await supabase
    .from("wallpapers")
    .select("*, histories!inner(*)")
    .eq("histories.user_id", userId)
    .eq("histories.is_liked", true)
    .range(offset, offset + 10);

  if (error) {
    toast.error(error.message);
    return [];
  }

  return snakeToCamel(data);
}
