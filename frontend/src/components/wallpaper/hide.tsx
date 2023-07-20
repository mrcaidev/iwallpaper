import clsx from "clsx";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import { supabase } from "utils/supabase";
import { Status, useWallpaper } from "./context";

type Props = {
  isThumbnail?: boolean;
};

export function Hide({ isThumbnail = false }: Props) {
  const { id, status, setStatus } = useWallpaper();

  const handleClick = async () => {
    const previousStatus = status;

    setStatus((status) =>
      status === Status.HIDDEN ? Status.UNBIASED : Status.HIDDEN,
    );

    const { error } = await supabase
      .from("histories")
      .update({ is_liked: false, is_hidden: previousStatus !== Status.HIDDEN })
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
      {status === Status.HIDDEN ? <Eye size={16} /> : <EyeOff size={16} />}
      <span className={clsx(isThumbnail && "sr-only")}>
        {status === Status.HIDDEN ? "Show" : "Hide"}
      </span>
    </button>
  );
}
