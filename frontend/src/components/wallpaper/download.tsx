import { useUser } from "contexts/user";
import download from "downloadjs";
import { Download as DownloadIcon } from "react-feather";
import { supabase } from "utils/supabase";
import { useWallpaper } from "./context";

export function Download() {
  const { id, rawUrl } = useWallpaper();

  const user = useUser();

  const handleClick = async () => {
    download(rawUrl);

    if (!user) {
      return;
    }

    await supabase
      .from("histories")
      .update({ is_downloaded: true })
      .eq("wallpaper_id", id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="col-span-2 flex justify-center items-center gap-2 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-200/90 dark:bg-slate-800/90 font-medium hover:opacity-85 transition-opacity"
    >
      <DownloadIcon size={16} />
      Download
    </button>
  );
}
