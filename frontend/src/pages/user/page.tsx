import { AuthGuard } from "components/guards";
import { Masonry } from "components/masonry";
import { useInfiniteScroll } from "hooks/use-infinite-scroll";
import { useTitle } from "hooks/use-title";
import { useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { snakeToCamel } from "utils/case";
import { FetcherResponse } from "utils/fetcher";
import { supabase } from "utils/supabase";
import { User, Wallpaper } from "utils/types";
import { Profile } from "./profile";

export function Page() {
  useTitle("Likes");

  const { id: userId } = useParams();

  const { data: user, error } = useLoaderData() as FetcherResponse<User>;

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  const bottomRef = useRef<HTMLParagraphElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (!userId) {
      return;
    }

    fetchLikedWallpapers(userId, wallpapers.length).then((wallpapers) => {
      setWallpapers((prevWallpapers) => [...prevWallpapers, ...wallpapers]);
    });
  });

  if (error) {
    toast.error(error.message);
    return null;
  }

  return (
    <AuthGuard>
      <div className="px-8 py-4 mt-20">
        <Profile user={user} />
        <Masonry wallpapers={wallpapers} />
        <p ref={bottomRef} className="my-8 text-center">
          End of liked wallpapers
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
