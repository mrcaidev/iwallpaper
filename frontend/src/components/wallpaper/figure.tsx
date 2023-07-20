import clsx from "clsx";
import { Status, useWallpaper } from "./context";

type Props = {
  isThumbnail?: boolean;
};

export function Figure({ isThumbnail = false }: Props) {
  const { regularUrl, thumbnailUrl, status } = useWallpaper();

  return (
    <div className="relative">
      <img
        src={isThumbnail ? thumbnailUrl : regularUrl}
        alt={isThumbnail ? "Wallpaper thumbnail." : "Regular sized wallpaper."}
        loading="lazy"
        decoding="async"
        className={clsx(
          "w-full",
          isThumbnail || "max-h-2xl",
          status === Status.HIDDEN && "blur-xl",
        )}
      />
      {status === Status.HIDDEN && (
        <div className="absolute left-1/2 top-1/2 -translate-1/2">
          <p className="space-y-1 px-4 py-2 rounded-md border-1 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-bold text-lg">
            Hidden
          </p>
        </div>
      )}
    </div>
  );
}
