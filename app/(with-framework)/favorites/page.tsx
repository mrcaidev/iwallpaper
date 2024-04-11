import { fetchFavorites } from "./actions";
import { FavoritesPageMasonry } from "./masonry";

export default async function FavoritesPage() {
  const initialWallpapers = await fetchFavorites({ take: 30, skip: 0 });

  return <FavoritesPageMasonry initialWallpapers={initialWallpapers} />;
}
