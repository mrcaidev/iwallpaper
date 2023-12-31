import { Masonry } from "components/masonry";
import { useTitle } from "hooks/use-title";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { FetcherResponse } from "utils/fetcher";
import { Wallpaper } from "utils/types";
import { NoResult } from "./no-result";

export function Page() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "Search";
  useTitle(query);

  const { data, error } = useLoaderData() as FetcherResponse<Wallpaper[]>;

  if (error || data.length === 0) {
    return <NoResult />;
  }

  return (
    <div className="px-8 py-4 mt-20">
      <h1 className="mb-8 font-bold text-2xl">Search results for {query}</h1>
      <Masonry wallpapers={data} />
      <p className="my-8 text-center text-slate-600 dark:text-slate-400">
        End of search results
      </p>
    </div>
  );
}
