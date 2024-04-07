import asyncio
import logging
import urllib.parse
from typing import Annotated

from aiohttp import ClientSession, TCPConnector
from fastapi import APIRouter, Query, status
from postgrest.types import CountMethod
from pydantic import BaseModel

from .embedding import create_embedding
from .supabase import supabase_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/scrape")


class Body(BaseModel):
    quantity: Annotated[int, Query(ge=1, le=5000)] = 30


@router.post("/", status_code=status.HTTP_201_CREATED)
async def scrape_wallpapers(body: Body):
    wallpapers = await scrape_unsplash(body.quantity)
    embeddings = create_embeddings(wallpapers)
    wallpapers = [
        {**wallpaper, "embedding": embedding}
        for wallpaper, embedding in zip(wallpapers, embeddings)
    ]
    upserted_count = upsert_wallpapers(wallpapers)
    return {"count": upserted_count}


def calculate_per_page(quantity: int):
    MAX_PER_PAGE = 30
    MIN_PER_PAGE = 5

    if quantity <= MAX_PER_PAGE:
        return quantity

    for per_page in range(MAX_PER_PAGE, MIN_PER_PAGE - 1, -1):
        if quantity % per_page == 0:
            return per_page

    return MAX_PER_PAGE


def build_page_params(quantity: int):
    per_page = calculate_per_page(quantity)
    page_num = quantity // per_page

    logger.debug(f"{quantity} wallpapers = {page_num} page(s) * {per_page} per page.")

    return [{"page": page, "per_page": per_page} for page in range(1, page_num + 1)]


async def scrape_page(session: ClientSession, params: dict):
    async with session.get("/napi/topics/wallpapers/photos", params=params) as response:
        wallpapers = await response.json()

    logger.debug(f"Fetched page {params['page']}.")

    return [wallpaper["slug"] for wallpaper in wallpapers if not wallpaper["plus"]]


async def scrape_wallpaper(session: ClientSession, slug: str):
    async with session.get("/napi/photos/" + slug) as response:
        wallpaper = await response.json()

    logger.debug(f"Fetched wallpaper {slug}.")

    return {
        "slug": wallpaper["slug"],
        "pathname": urllib.parse.urlparse(wallpaper["urls"]["raw"]).path[1:],
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
        page_params = build_page_params(quantity)

        logger.info(f"Paginated into {len(page_params)} pages.")

        awaitable_wallpaper_slugs_list = [
            scrape_page(session, page_param) for page_param in page_params
        ]
        wallpaper_slugs_list = await asyncio.gather(*awaitable_wallpaper_slugs_list)
        wallpaper_slugs = [
            wallpaper_slug
            for wallpaper_slugs in wallpaper_slugs_list
            for wallpaper_slug in wallpaper_slugs
        ]

        logger.info(f"Fetched {len(wallpaper_slugs)} slugs.")

        awaitable_wallpapers = [
            scrape_wallpaper(session, wallpaper_slug)
            for wallpaper_slug in wallpaper_slugs
        ]
        wallpapers = await asyncio.gather(*awaitable_wallpapers)

        logger.info(f"Fetched {len(wallpapers)} wallpapers.")

    return wallpapers


def create_embeddings(wallpapers: list[dict]):
    sentences = [" ".join(wallpaper["tags"]) for wallpaper in wallpapers]
    embeddings = create_embedding(sentences)

    logger.info(f"Created {len(embeddings)} wallpaper embeddings.")

    return embeddings


def upsert_wallpapers(wallpapers: list[dict]):
    upserted_count = (
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

    logger.info(f"Upserted {upserted_count} wallpapers.")

    return upserted_count
