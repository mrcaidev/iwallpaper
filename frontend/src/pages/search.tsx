import { Masonry } from "components/masonry";
import mockWallpapers from "mocks/wallpapers.json";
import { useEffect, useState } from "react";
import { Frown, Loader } from "react-feather";
import { Link, useSearchParams } from "react-router-dom";
import { fetcher } from "utils/fetcher";
import { Wallpaper } from "utils/types";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [isSearching, setIsSearching] = useState(false);

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  useEffect(() => {
    if (!query) {
      return;
    }

    setIsSearching(true);

    if (import.meta.env.DEV) {
      const timer = setTimeout(() => {
        setWallpapers(mockWallpapers);
        setIsSearching(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    }

    const abortController = new AbortController();

    fetcher<Wallpaper[]>("/search?query=" + encodeURIComponent(query), {
      signal: abortController.signal,
    }).then((wallpapers) => {
      setIsSearching(false);

      if (wallpapers) {
        setWallpapers(wallpapers);
      }
    });

    return () => {
      abortController.abort();
      setIsSearching(false);
    };
  }, [query]);

  if (isSearching) {
    return (
      <div className="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Loader size={16} className="animate-spin" />
          Wait a second. We are searching wallpapers for you...
        </p>
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-1 fixed left-0 right-0 top-0 bottom-0">
        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Frown size={16} />
          We did not find any similar wallpapers
        </p>
        <Link
          to="/"
          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 hover:text-slate-200 transition-colors underline underline-offset-4"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <Masonry wallpapers={wallpapers} />
      <div className="my-8 text-center text-slate-600 dark:text-slate-400">
        End of search results
      </div>
    </>
  );
}
