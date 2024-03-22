"""
向量搜索引擎。
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Query

from .supabase import supabase_client
from .vectorizer import vectorizer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/search")


@router.get("/")
def search(
    query: Annotated[str, Query(min_length=1, max_length=50)],
    threshold: Annotated[float, Query(gt=0, lt=1)] = 0.6,
    quantity: Annotated[int, Query(gt=0, lt=100)] = 20,
):
    """
    将用户输入的搜索词转换为向量，然后根据向量相似度搜索壁纸。
    """
    query_embedding = vectorizer.encode(query, normalize_embeddings=True).tolist()

    wallpapers = (
        supabase_client.rpc(
            "search_wallpapers",
            {
                "query_embedding": query_embedding,
                "threshold": threshold,
                "quantity": quantity,
            },
        )
        .execute()
        .data
    )

    logger.info(f"Found {len(wallpapers)} search results.")

    return {"data": wallpapers}
