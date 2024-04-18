import { rateLimit } from "./rate-limit.ts";

const fetchUnsplash = rateLimit(fetch, 50);

function calculatePerPage(quantity: number) {
  const MAX_PER_PAGE = 30;
  const MIN_PER_PAGE = 5;

  for (let perPage = MAX_PER_PAGE; perPage >= MIN_PER_PAGE; perPage--) {
    if (quantity % perPage === 0) {
      return perPage;
    }
  }

  return MAX_PER_PAGE;
}

function buildPageUrls(quantity: number) {
  const perPage = calculatePerPage(quantity);
  const pageNum = Math.floor(quantity / perPage);

  return Array.from({ length: pageNum }, (_, index) => {
    const url = new URL("https://unsplash.com/napi/topics/wallpapers/photos");
    url.searchParams.set("page", String(index + 1));
    url.searchParams.set("per_page", String(perPage));
    return url.toString();
  });
}

type PageJson = {
  slug: string;
  plus: boolean;
}[];

async function scrapePage(url: string) {
  const response = await fetchUnsplash(url);
  const json: PageJson = await response.json();
  return json.filter(({ plus }) => !plus).map(({ slug }) => slug);
}

function buildWallpaperUrls(slugs: string[]) {
  return slugs.map((slug: string) => {
    const url = new URL(slug, "https://unsplash.com/napi/photos/");
    return url.toString();
  });
}

type WallpaperJson = {
  slug: string;
  urls: {
    raw: string;
  };
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  tags: {
    title: string;
  }[];
};

async function scrapeWallpaper(url: string) {
  const response = await fetchUnsplash(url);
  const json: WallpaperJson = await response.json();
  return {
    slug: json.slug,
    pathname: new URL(json.urls.raw).pathname,
    description: json.description ?? json.alt_description ?? "",
    width: json.width,
    height: json.height,
    tags: json.tags.map(({ title }) => title),
  };
}

export async function scrapeUnsplash(quantity: number) {
  const pageUrls = buildPageUrls(quantity);
  const slugsList = await Promise.all(pageUrls.map(scrapePage));
  const slugs = slugsList.flat();
  console.log(`Fetched ${slugs.length} slugs.`);

  const wallpaperUrls = buildWallpaperUrls(slugs);
  const wallpapers = await Promise.all(wallpaperUrls.map(scrapeWallpaper));
  console.log(`Fetched ${wallpapers.length} wallpapers.`);

  return wallpapers;
}
