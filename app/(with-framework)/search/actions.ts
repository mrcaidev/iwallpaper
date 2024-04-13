"use server";

import type { Wallpaper } from "utils/types";

type Options = {
  take: number;
  skip: number;
};

export async function search(query: string, { take, skip }: Options) {
  const url = new URL("http://localhost:8000/search");
  url.searchParams.append("query", query);
  url.searchParams.append("take", take.toString());
  url.searchParams.append("skip", skip.toString());
  const response = await fetch(url);
  const wallpapers: Wallpaper[] = await response.json();
  return wallpapers;
}
