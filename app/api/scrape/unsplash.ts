export async function scrapeUnsplash(quantity: number) {
  const pageUrls = buildPageUrls(quantity);
  const slugsList = await Promise.all(pageUrls.map(scrapePage));
  const slugs = slugsList.flat();

  const wallpaperUrls = buildWallpaperUrls(slugs);
  const wallpapers = await Promise.all(wallpaperUrls.map(scrapeWallpaper));

  return wallpapers;
}

function calculatePerPage(quantity: number) {
  const MAX_PER_PAGE = 30;
  const MIN_PER_PAGE = 5;

  if (quantity <= MAX_PER_PAGE) {
    return quantity;
  }

  for (let perPage = MAX_PER_PAGE; perPage >= MIN_PER_PAGE; perPage--) {
    if (quantity % perPage === 0) {
      return perPage;
    }
  }

  return MAX_PER_PAGE;
}

function buildPageUrl(page: number, perPage: number) {
  return `https://unsplash.com/napi/topics/wallpapers/photos?page=${page}&per_page=${perPage}`;
}

function buildPageUrls(quantity: number) {
  const perPage = calculatePerPage(quantity);
  const pageTotal = Math.floor(quantity / perPage);
  return [...Array(pageTotal).keys()].map((i) => buildPageUrl(i + 1, perPage));
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

function buildWallpaperUrls(slugs: string[]) {
  return slugs.map(buildWallpaperUrl);
}

type WallpaperJson = {
  slug: string;
  description: string;
  alt_description: string;
  urls: {
    raw: string;
  };
  width: number;
  height: number;
  tags: {
    title: string;
  }[];
};

async function scrapeWallpaper(url: string) {
  const response = await fetch(url);
  const wallpaper: WallpaperJson = await response.json();

  return {
    slug: wallpaper.slug,
    description: wallpaper.description || wallpaper.alt_description || "",
    pathname: new URL(wallpaper.urls.raw).pathname,
    width: wallpaper.width,
    height: wallpaper.height,
    tags: wallpaper.tags.map(({ title }) => title),
  };
}
