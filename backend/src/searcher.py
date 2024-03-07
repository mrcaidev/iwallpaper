"""
向量搜索引擎。
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Query
from pydantic import PositiveInt

from .supabase import supabase_client
from .transformer import transformer

__all__ = ["router"]

router = APIRouter(prefix="/search")
logger = logging.getLogger(__name__)


@router.get("/")
def search(
    query: Annotated[str, Query(min_length=1, max_length=50)],
    quantity: PositiveInt = 20,
):
    """
    将用户输入的搜索词转换为向量，然后根据向量相似度搜索壁纸。
    """
    query_embedding = transformer.encode(query).tolist()

    wallpapers = (
        supabase_client.rpc(
            "search_wallpapers",
            {"query": query_embedding, "quantity": quantity},
        )
        .execute()
        .data
    )

    logger.info(f"Found {len(wallpapers)} search results.")

    return {"data": wallpapers}
