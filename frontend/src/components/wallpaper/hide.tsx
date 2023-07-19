import clsx from "clsx";
import { Eye, EyeOff } from "react-feather";
import { Status, useWallpaper } from "./context";

type Props = {
  isThumbnail?: boolean;
};

export function Hide({ isThumbnail = false }: Props) {
  const { status, setStatus } = useWallpaper();

  const handleClick = () => {
    setStatus((status) =>
      status === Status.HIDDEN ? Status.UNBIASED : Status.HIDDEN,
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex justify-center items-center gap-2 w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-200/90 dark:bg-slate-800/90 font-medium hover:opacity-85 transition-opacity"
    >
      {status === Status.HIDDEN ? <Eye size={16} /> : <EyeOff size={16} />}
      <span className={clsx(isThumbnail && "sr-only")}>
        {status === Status.HIDDEN ? "Show" : "Hide"}
      </span>
    </button>
  );
}
