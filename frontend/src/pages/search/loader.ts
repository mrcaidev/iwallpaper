import mockWallpapers from "mocks/wallpapers.json";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { fetcher } from "utils/fetcher";
import { Wallpaper } from "utils/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get("query");

  if (!query) {
    return redirect("/");
  }

  if (import.meta.env.DEV) {
    return { data: mockWallpapers, error: null };
  }

  const response = await fetcher<Wallpaper[]>(
    "/search?query=" + encodeURIComponent(query),
    { signal: request.signal },
  );

  return response;
}
