import type { Metadata } from "next";
import { HomePageMasonry } from "./masonry";
import mockWallpapers from "./mock-wallpapers.json";

export const metadata: Metadata = {
  title: "iWallpaper - Wallpaper Exploring Platform",
};

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Recommended for you
      </h1>
      <HomePageMasonry initialWallpapers={mockWallpapers} />
    </div>
  );
}
