import { search } from "./actions";
import { SearchPageMasonry } from "./masonry";

type Props = {
  searchParams: {
    query: string;
  };
};

export default async function SearchPage({ searchParams: { query } }: Props) {
  const initialWallpapers = await search(query, { take: 30, skip: 0 });

  return (
    <SearchPageMasonry initialWallpapers={initialWallpapers} query={query} />
  );
}
