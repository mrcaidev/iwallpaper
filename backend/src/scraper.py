import asyncio
import urllib.parse

from aiohttp import ClientSession, TCPConnector
from postgrest.types import CountMethod

from .gte import gte_model
from .supabase import supabase_client


def calculate_per_page(quantity: int):
    MAX_PER_PAGE = 30
    MIN_PER_PAGE = 5

    for per_page in range(MAX_PER_PAGE, MIN_PER_PAGE - 1, -1):
        if quantity % per_page == 0:
            return per_page

    return MAX_PER_PAGE


async def scrape_page(session: ClientSession, page: int, per_page: int):
    async with session.get(
        "/napi/topics/wallpapers/photos",
        params={"page": page, "per_page": per_page},
    ) as response:
        wallpapers = await response.json()

    return [wallpaper["slug"] for wallpaper in wallpapers if not wallpaper["plus"]]


async def scrape_wallpaper(session: ClientSession, slug: str):
    async with session.get("/napi/photos/" + slug) as response:
        wallpaper = await response.json()

    return {
        "slug": wallpaper["slug"],
        "pathname": urllib.parse.urlparse(wallpaper["urls"]["raw"]).path,
        "description": wallpaper["description"] or wallpaper["alt_description"] or "",
        "width": wallpaper["width"],
        "height": wallpaper["height"],
        "tags": [tag["title"] for tag in wallpaper["tags"]],
    }


async def scrape_unsplash(quantity: int):
    async with ClientSession(
        base_url="https://unsplash.com",
        connector=TCPConnector(limit=10),
    ) as session:
        per_page = calculate_per_page(quantity)
        page_total = quantity // per_page
        print(f"Paginated into {page_total} pages, {per_page} per page.")

        awaitable_slugs_list = [
            scrape_page(session, page, per_page) for page in range(1, page_total + 1)
        ]
        slugs_list = await asyncio.gather(*awaitable_slugs_list)
        slugs = [slug for slugs in slugs_list for slug in slugs]
        print(f"Fetched {len(slugs)} slugs.")

        awaitable_wallpapers = [scrape_wallpaper(session, slug) for slug in slugs]
        wallpapers = await asyncio.gather(*awaitable_wallpapers)
        print(f"Fetched {len(wallpapers)} wallpapers.")

    return wallpapers


def create_embeddings(wallpapers: list[dict]):
    sentences = [" ".join(wallpaper["tags"]) for wallpaper in wallpapers]
    embeddings = gte_model.encode(sentences, normalize_embeddings=True).tolist()
    print(f"Created {len(embeddings)} embeddings.")
    return embeddings


def zip_wallpapers_embeddings(wallpapers: list[dict], embeddings: list[list[float]]):
    return [
        {**wallpaper, "embedding": embedding}
        for wallpaper, embedding in zip(wallpapers, embeddings)
    ]


def upsert_wallpapers(wallpapers: list[dict]):
    count = (
        supabase_client.table("wallpapers")
        .upsert(
            wallpapers,
            count=CountMethod.exact,
            ignore_duplicates=True,
            on_conflict="slug",
        )
        .execute()
        .count
    )
    print(f"Upserted {count} wallpapers.")


async def main(quantity: int):
    wallpapers = await scrape_unsplash(quantity)
    embeddings = create_embeddings(wallpapers)
    wallpapers = zip_wallpapers_embeddings(wallpapers, embeddings)
    upsert_wallpapers(wallpapers)


if __name__ == "__main__":
    import sys

    quantity = 10 if len(sys.argv) < 2 else int(sys.argv[1])
    asyncio.run(main(quantity))
