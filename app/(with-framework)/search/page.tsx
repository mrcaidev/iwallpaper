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
    <div className="p-4 lg:p-6">
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Search results for &quot;{query}&quot;
      </h1>
      <SearchPageMasonry query={query} initialWallpapers={initialWallpapers} />
    </div>
  );
}
