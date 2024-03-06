"""
爬取 Unsplash 上的壁纸信息。
"""

import asyncio
import logging

from aiohttp import ClientSession
from fastapi import APIRouter, status
from postgrest.types import ReturnMethod
from pydantic import BaseModel, PositiveInt

from .supabase import supabase_client

__all__ = ["router"]

router = APIRouter(prefix="/scrape")
logger = logging.getLogger(__name__)


class Demand(BaseModel):
    """
    爬虫接口的请求体的数据类型。
    """

    quantity: PositiveInt


@router.post("/", status_code=status.HTTP_201_CREATED)
async def scrape(demand: Demand):
    """
    爬取 Unsplash 上的壁纸信息。
    """
    wallpapers = await scrape_unsplash(demand.quantity)
    return {"data": len(wallpapers)}


def calculate_per_page(quantity: int):
    """
    在给定的总需求量下，计算最合适的页容量。
    """
    # Unsplash API 限制了最大页容量为 30。
    MAX_PER_PAGE = 30

    # 页容量太小会导致请求过多，浪费资源。
    MIN_PER_PAGE = 5

    # 找到尽可能大的页容量，并且使得总需求量能够被整除。
    for per_page in range(MAX_PER_PAGE, MIN_PER_PAGE - 1, -1):
        if quantity % per_page == 0:
            return per_page

    # 如果找不到能整除的页容量，就使用最大页容量。
    return MAX_PER_PAGE


def build_page_params(quantity: int):
    """
    构建要爬取的各页的 URL 参数。
    """
    per_page = calculate_per_page(quantity)
    page_num = quantity // per_page

    logger.debug(f"{quantity} wallpapers = {page_num} page(s) * {per_page} per page.")

    return [{"page": page, "per_page": per_page} for page in range(1, page_num + 1)]


async def scrape_page(session: ClientSession, params: dict):
    """
    爬取一页壁纸，从中提取出每张壁纸的 slug。
    """
    logger.debug(f"Fetching page {params['page']}.")

    async with session.get("/napi/topics/wallpapers/photos", params=params) as response:
        wallpapers = await response.json()

    logger.debug(f"Fetched page {params['page']}.")

    return [wallpaper["slug"] for wallpaper in wallpapers if not wallpaper["plus"]]


async def scrape_wallpaper(session: ClientSession, slug: str):
    """
    爬取一张壁纸，从中提取出有用的信息。
    """
    logger.debug(f"Fetching wallpaper {slug}.")

    async with session.get("/napi/photos/" + slug) as response:
        wallpaper = await response.json()

    logger.debug(f"Fetched wallpaper {slug}.")

    return {
        "slug": wallpaper["slug"],
        "description": wallpaper["alt_description"],
        "raw_url": wallpaper["urls"]["raw"],
        "regular_url": wallpaper["urls"]["regular"],
        "thumbnail_url": wallpaper["urls"]["small"],
        "width": wallpaper["width"],
        "height": wallpaper["height"],
        "tags": [tag["title"] for tag in wallpaper["tags"]],
    }


async def scrape_unsplash(quantity: int):
    """
    从 Unsplash 爬取指定数量的壁纸。
    """
    async with ClientSession(base_url="https://unsplash.com") as session:
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

        wallpapers = (
            supabase_client.table("wallpapers")
            .upsert(
                wallpapers,
                returning=ReturnMethod.representation,
                ignore_duplicates=True,
                on_conflict="slug",
            )
            .execute()
            .data
        )

        logger.info(f"Upserted {len(wallpapers)} wallpapers.")

    return wallpapers
