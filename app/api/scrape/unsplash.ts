import { generateBlur } from "utils/blur";

export async function scrape(limit: number, offset: number) {
  const pageUrls = buildPageUrls(limit, offset);

  const slugsPromises = pageUrls.map(scrapePage);
  const slugsList = await Promise.all(slugsPromises);
  const slugs = slugsList.flat();

  const wallpaperUrls = slugs.map(buildWallpaperUrl);

  const wallpaperPromises = wallpaperUrls.map(scrapeWallpaper);
  const wallpapers = await Promise.all(wallpaperPromises);

  return wallpapers;
}

function buildPageUrls(limit: number, offset: number) {
  const perPage = calculatePerPage(limit);
  const startPage = Math.ceil(offset / perPage) + 1;
  const pageTotal = Math.floor(limit / perPage);

  return Array(pageTotal)
    .fill("")
    .map((_, index) => buildPageUrl(startPage + index, perPage));
}

function calculatePerPage(limit: number) {
  const MIN_PER_PAGE = 10;
  const MAX_PER_PAGE = 30;

  if (limit <= MAX_PER_PAGE) {
    return limit;
  }

  for (let perPage = MAX_PER_PAGE; perPage >= MIN_PER_PAGE; perPage--) {
    if (limit % perPage === 0) {
      return perPage;
    }
  }

  return MAX_PER_PAGE;
}

function buildPageUrl(page: number, perPage: number) {
  return `https://unsplash.com/napi/topics/wallpapers/photos?page=${page}&per_page=${perPage}`;
}

type PageJson = {
  slug: string;
  plus: boolean;
}[];

async function scrapePage(url: string) {
  const response = await fetch(url);
  const page: PageJson = await response.json();
  return page.filter(({ plus }) => !plus).map(({ slug }) => slug);
}

function buildWallpaperUrl(slug: string) {
  return `https://unsplash.com/napi/photos/${slug}`;
}

type WallpaperJson = {
  slug: string;
  width: number;
  height: number;
  color: string;
  description: string;
  alt_description: string;
  urls: {
    raw: string;
  };
  tags: {
    title: string;
  }[];
  plus: boolean;
};

async function scrapeWallpaper(url: string) {
  const response = await fetch(url);
  const wallpaper: WallpaperJson = await response.json();
  return {
    slug: wallpaper.slug,
    pathname: new URL(wallpaper.urls.raw).pathname,
    width: wallpaper.width,
    height: wallpaper.height,
    blur: generateBlur(wallpaper.color),
    description: wallpaper.description || wallpaper.alt_description || "",
    tags: wallpaper.tags.map(({ title }) => title),
  };
}
