"use client";

import { Masonry } from "components/masonry";
import { useInfiniteScroll } from "components/masonry/use-infinite-scroll";
import { useRef, useState } from "react";
import type { Wallpaper } from "utils/types";
import { search } from "./actions";

type Props = {
  query: string;
  initialWallpapers: Wallpaper[];
};

export function SearchPageMasonry({ query, initialWallpapers }: Props) {
  const [skip, setSkip] = useState(30);
  const [wallpapers, setWallpapers] = useState(initialWallpapers);

  const bottomRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(bottomRef, () => {
    search(query, { take: 30, skip }).then((nextWallpapers) => {
      setWallpapers([...wallpapers, ...nextWallpapers]);
      setSkip((skip) => skip + 30);
    });
  });

  return (
    <>
      <Masonry wallpapers={wallpapers} />
      <p ref={bottomRef} className="text-center text-sm">
        You have reached the bottom...
      </p>
    </>
  );
}
