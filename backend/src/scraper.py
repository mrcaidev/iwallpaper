import asyncio
import logging
import os
from time import sleep

import aiofiles
from aiohttp import ClientSession
from fastapi import APIRouter, status

from .constants import IMAGE_DIR
from .supabase import supabase_client, tag_collection
from .vectorizer import vectorizer

router = APIRouter(prefix="/scrape")


@router.post("/bootstrap", status_code=status.HTTP_201_CREATED)
async def bootstrap():
    RATE_LIMIT_INTERVAL = 60
    BATCH = 500
    TOTAL_TIMES = 4

    wallpapers = []

    for offset in range(TOTAL_TIMES):
        if offset != 0:
            logging.info("Recovering from rate limit... (60 seconds)")
            sleep(RATE_LIMIT_INTERVAL)

        new_wallpapers = await scrape_unsplash(BATCH, with_tags=True, offset=offset)
        wallpapers.extend(new_wallpapers)

    corpus = [" ".join(wallpaper["tags"]) for wallpaper in wallpapers]
    tag_vectors = vectorizer.fit_transform(corpus)
    insert_tag_vectors(wallpapers, tag_vectors)

    return {"data": len(wallpapers)}


@router.post("/cron", status_code=status.HTTP_201_CREATED)
async def cron():
    wallpapers = await scrape_unsplash(50)

    tag_vectors = ...  # TODO: Use CNN to predict tag vectors.
    insert_tag_vectors(wallpapers, tag_vectors)

    tags_list = [find_similar_tags(tag_vector) for tag_vector in tag_vectors]
    tagged_wallpapers = add_tags(wallpapers, tags_list)

    supabase_client.table("wallpapers").upsert(tagged_wallpapers).execute()

    return {"data": len(wallpapers)}


def calculate_per_page(quantity: int):
    MAX_PER_PAGE = 30
    MIN_PER_PAGE = 3

    if quantity <= MAX_PER_PAGE:
        return quantity

    for per_page in range(MAX_PER_PAGE, MIN_PER_PAGE - 1, -1):
        if quantity % per_page == 0:
            return per_page

    return MAX_PER_PAGE


def build_page_urls(quantity: int, offset: int):
    per_page = calculate_per_page(quantity)
    page_total = quantity // per_page
    start_page = offset * page_total + 1
    end_page = (offset + 1) * page_total

    logging.info(f"Scraping pages {start_page}-{end_page}, {per_page} per page")

    return [build_page_url(page, per_page) for page in range(start_page, end_page + 1)]


def build_page_url(page: int, per_page: int):
    return f"https://unsplash.com/napi/topics/wallpapers/photos?page={page}&per_page={per_page}"


def build_wallpaper_url(slug: str):
    return f"https://unsplash.com/napi/photos/{slug}"


def build_file_path(wallpaper_id: str):
    return os.path.join(IMAGE_DIR, f"{wallpaper_id}.jpg")


async def scrape_page(session: ClientSession, page_url: str):
    async with session.get(page_url) as response:
        wallpapers = await response.json()

    return [wallpaper["slug"] for wallpaper in wallpapers if not wallpaper["plus"]]


async def scrape_wallpaper(session: ClientSession, wallpaper_url: str, with_tags: bool):
    async with session.get(wallpaper_url) as response:
        wallpaper = await response.json()

    return {
        "slug": wallpaper["slug"],
        "raw_url": wallpaper["urls"]["raw"],
        "regular_url": wallpaper["urls"]["regular"],
        "thumbnail_url": wallpaper["urls"]["small"],
        "width": wallpaper["width"],
        "height": wallpaper["height"],
        "tags": [tag["title"] for tag in wallpaper["tags"]] if with_tags else [],
    }


async def scrape_image(session: ClientSession, wallpaper: dict):
    image_url = wallpaper["thumbnail_url"]

    async with session.get(image_url) as response:
        image = await response.read()

    file_path = build_file_path(wallpaper["id"])

    async with aiofiles.open(file_path, "wb") as file:
        await file.write(image)

    return file_path


async def scrape_unsplash(quantity: int, with_tags=False, offset=0):
    async with ClientSession() as session:
        page_urls = build_page_urls(quantity, offset)

        awaitable_slugs_list = [
            scrape_page(session, page_url) for page_url in page_urls
        ]
        slugs_list = await asyncio.gather(*awaitable_slugs_list)
        slugs = [slug for slugs in slugs_list for slug in slugs]

        logging.info(f"Fetched {len(slugs)} slugs")

        wallpaper_urls = [build_wallpaper_url(slug) for slug in slugs]

        awaitable_wallpapers = [
            scrape_wallpaper(session, wallpaper_url, with_tags)
            for wallpaper_url in wallpaper_urls
        ]
        wallpapers = await asyncio.gather(*awaitable_wallpapers)

        logging.info(f"Fetched {len(wallpapers)} wallpapers")

        wallpapers = (
            supabase_client.table("wallpapers")
            .upsert(
                wallpapers,
                returning="representation",
                ignore_duplicates=True,
                on_conflict="slug",
            )
            .execute()
            .data
        )

        logging.info(f"Upserted {len(wallpapers)} wallpapers")

        awaitable_images = [
            scrape_image(session, wallpaper) for wallpaper in wallpapers
        ]
        await asyncio.gather(*awaitable_images)

        logging.info(f"Fetched {len(wallpapers)} images")

    return wallpapers


def insert_tag_vectors(wallpapers: list[dict], tag_vectors: list[list[float]]):
    wallpaper_ids = [wallpaper["id"] for wallpaper in wallpapers]
    tag_collection.upsert(list(zip(wallpaper_ids, tag_vectors)))

    logging.info(f"Upserted {len(wallpapers)} tag vectors")

    tag_collection.create_index()

    logging.info(f"Created index on vecs.tag_vectors")


def find_similar_tags(tag_vector: list[float]):
    similar_wallpaper_id = tag_collection.query(tag_vector, limit=1)[0]

    logging.info(f"Found similar wallpaper: {similar_wallpaper_id}")

    similar_wallpaper = (
        supabase_client.table("wallpapers")
        .select("tags")
        .eq("id", similar_wallpaper_id)
        .single()
        .execute()
        .data
    )

    logging.info("Fetched similar wallpaper")

    return similar_wallpaper["tags"]


def add_tags(wallpapers: list[dict], tags_list: list[list[str]]):
    assert len(wallpapers) == len(tags_list)

    for wallpaper, tags in zip(wallpapers, tags_list):
        wallpaper["tags"] = tags

    return wallpapers
