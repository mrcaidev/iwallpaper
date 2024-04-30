import { PageTitle } from "components/ui/page-title";
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
      <PageTitle>Recommended for you</PageTitle>
      <HomePageMasonry initialWallpapers={initialWallpapers} />
    </div>
  );
}
