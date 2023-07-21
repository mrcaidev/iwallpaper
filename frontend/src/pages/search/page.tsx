import { Masonry } from "components/masonry";
import { useLoaderData } from "react-router-dom";
import { FetcherResponse } from "utils/fetcher";
import { Wallpaper } from "utils/types";
import { NoResult } from "./no-result";

export function Page() {
  const { data, error } = useLoaderData() as FetcherResponse<Wallpaper[]>;

  if (error || data.length === 0) {
    return <NoResult />;
  }

  return (
    <div className="mt-20 px-8 py-4">
      <Masonry wallpapers={data} />
      <p className="my-8 text-center text-slate-600 dark:text-slate-400">
        End of search results
      </p>
    </div>
  );
}
