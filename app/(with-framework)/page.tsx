import type { Metadata } from "next";
import { fetchRecommendations } from "./actions";
import { HomePageMasonry } from "./masonry";

export const metadata: Metadata = {
  title: "iWallpaper - Wallpaper Exploring Platform",
};

export default async function HomePage() {
  const initialWallpapers = await fetchRecommendations({ take: 30 });

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Recommended for you
      </h1>
      <HomePageMasonry initialWallpapers={initialWallpapers} />
    </div>
  );
}
