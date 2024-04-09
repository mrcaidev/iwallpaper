import logging
from typing import Annotated

from fastapi import APIRouter, Query

from .embedding import create_embedding
from .supabase import supabase_client

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/search")


@router.get("/")
def hybrid_search_wallpapers(
    query: Annotated[str, Query(min_length=1, max_length=50)],
    take: Annotated[int, Query(ge=1, le=30)] = 30,
    skip: Annotated[int, Query(ge=0)] = 0,
):
    query_embedding = create_embedding(query)

    wallpapers = (
        supabase_client.rpc(
            "search_wallpapers",
            {
                "query": query,
                "query_embedding": query_embedding,
                "take": take,
                "skip": skip,
            },
        )
        .execute()
        .data
    )

    logger.info(f"Found {len(wallpapers)} search results.")

    return wallpapers
