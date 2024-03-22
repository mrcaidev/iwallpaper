import logging
from typing import Annotated

from fastapi import APIRouter, Query

from .supabase import supabase_client
from .vectorizer import vectorizer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/search")


@router.get("/")
def hybrid_search_wallpapers(
    query: Annotated[str, Query(min_length=1, max_length=50)],
    quantity: Annotated[int, Query(ge=1, le=100)] = 20,
):
    query_embedding = vectorizer.encode(
        query,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()

    wallpapers = (
        supabase_client.rpc(
            "search_wallpapers",
            {
                "query": query,
                "query_embedding": query_embedding,
                "quantity": quantity,
            },
        )
        .execute()
        .data
    )

    logger.info(f"Found {len(wallpapers)} search results.")

    return {"data": wallpapers}
