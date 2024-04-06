import { Masonry } from "components/masonry";
import type { Metadata } from "next";
import mockWallpapers from "./mock-wallpapers.json";

export const metadata: Metadata = {
  title: "iWallpaper - Wallpaper Exploring Platform",
};

export default function HomePage() {
  return (
    <div className="p-4 lg:p-6">
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Recommended for you
      </h1>
      <Masonry wallpapers={mockWallpapers} />
    </div>
  );
}
