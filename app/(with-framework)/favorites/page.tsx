import type { Metadata } from "next";
import Link from "next/link";
import { fetchFavorites } from "./actions";
import { FavoritesPageMasonry } from "./masonry";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your favorite wallpapers",
};

export default async function FavoritesPage() {
  const initialWallpapers = await fetchFavorites({ take: 30, skip: 0 });

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Your favorites
      </h1>
      {initialWallpapers.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 min-h-96 text-center">
          <p className="text-muted-foreground text-balance">
            You don&apos;t seem to have any favorite wallpapers yet.
          </p>
          <Link href="/" className="underline">
            Go explore now
          </Link>
        </div>
      ) : (
        <FavoritesPageMasonry initialWallpapers={initialWallpapers} />
      )}
    </div>
  );
}
