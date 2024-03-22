import logging
from typing import Annotated

from fastapi import APIRouter, Query

from .supabase import supabase_client
from .vectorizer import vectorizer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/search")


@router.get("/")
def semantic_search_wallpapers(
    query: Annotated[str, Query(min_length=1, max_length=50)],
    threshold: Annotated[float, Query(gt=0, lt=1)] = 0.6,
    quantity: Annotated[int, Query(ge=1, le=100)] = 20,
):
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
