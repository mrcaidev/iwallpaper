import Link from "next/link";
import { search } from "./actions";
import { SearchPageMasonry } from "./masonry";

type Props = {
  searchParams: {
    query: string;
  };
};

export function generateMetadata({ searchParams: { query } }: Props) {
  return {
    title: `Search results for "${query}"`,
    description: `Browse beautiful wallpapers about ${query} on iWallpaper`,
  };
}

export default async function SearchPage({ searchParams: { query } }: Props) {
  const initialWallpapers = await search(query, { take: 30, skip: 0 });

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 font-semibold text-lg md:text-2xl">
        Search results for &quot;{query}&quot;
      </h1>
      {initialWallpapers.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 min-h-96 text-center">
          <p className="text-muted-foreground text-balance">
            Can&apos;t find any wallpaper related to &quot;{query}&quot;.
          </p>
          <Link href="/" className="underline">
            Go back to homepage
          </Link>
        </div>
      ) : (
        <SearchPageMasonry
          query={query}
          initialWallpapers={initialWallpapers}
        />
      )}
    </div>
  );
}
