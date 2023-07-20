import download from "downloadjs";
import { Download as DownloadIcon } from "react-feather";
import { useWallpaper } from "./context";

export function Download() {
  const { rawUrl } = useWallpaper();

  return (
    <button
      type="button"
      onClick={() => download(rawUrl)}
      className="col-span-2 flex justify-center items-center gap-2 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-200/90 dark:bg-slate-800/90 font-medium hover:opacity-85 transition-opacity"
    >
      <DownloadIcon size={16} />
      Download
    </button>
  );
}
