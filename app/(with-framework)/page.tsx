import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iWallpaper - Wallpaper Exploring Platform",
};

export default function HomePage() {
  return (
    <div className="p-4 lg:p-6">
      <h1 className="font-semibold text-lg md:text-2xl">Page Title</h1>
    </div>
  );
}
