import { fetchFavorites } from "./actions";
import { FavoritesPageMasonry } from "./masonry";

export default async function FavoritesPage() {
  const initialWallpapers = await fetchFavorites({ take: 30, skip: 0 });

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Your favorites
      </h1>
      <FavoritesPageMasonry initialWallpapers={initialWallpapers} />
    </div>
  );
}
