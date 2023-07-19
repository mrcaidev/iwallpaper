import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 p-1 font-bold text-2xl hover:opacity-85 transition-opacity"
    >
      <img
        src="/favicon.svg"
        alt="Logo. Two hearts."
        width={32}
        height={32}
        className="w-8 h-8"
      />
      iWallpaper
    </Link>
  );
}
