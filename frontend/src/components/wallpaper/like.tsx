import clsx from "clsx";
import { Heart } from "react-feather";
import { toast } from "react-toastify";
import { supabase } from "utils/supabase";
import { Status, useWallpaper } from "./context";

type Props = {
  isThumbnail?: boolean;
};

export function Like({ isThumbnail = false }: Props) {
  const { id, status, setStatus } = useWallpaper();

  const handleClick = async () => {
    const previousStatus = status;

    setStatus((status) =>
      status === Status.LIKED ? Status.UNBIASED : Status.LIKED,
    );

    const { error } = await supabase
      .from("histories")
      .update({ is_liked: previousStatus !== Status.LIKED, is_hidden: false })
      .eq("wallpaper_id", id);

    if (error) {
      setStatus(previousStatus);
      toast.error(error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex justify-center items-center gap-2 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-200/90 dark:bg-slate-800/90 font-medium hover:opacity-85 transition-opacity"
    >
      <Heart
        size={16}
        className={clsx(
          status === Status.LIKED && "fill-red-500 stroke-red-500",
        )}
      />
      <span className={clsx(isThumbnail && "sr-only")}>
        {status === Status.LIKED ? "Liked" : "Like"}
      </span>
    </button>
  );
}
