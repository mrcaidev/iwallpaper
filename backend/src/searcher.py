import logging
from typing import Annotated

from fastapi import APIRouter, Query
from vecs import IndexMeasure

from .supabase import supabase_client, tag_collection
from .vectorizer import vectorizer

router = APIRouter(prefix="/search")


@router.get("/")
def search(query: Annotated[str, Query(min_length=1, max_length=50)]):
    logging.info(f"Query: {query}")

    query_vector = vectorizer.predict([query])[0]

    logging.info("Vectorized query")

    similar_wallpaper_ids = tag_collection.query(
        query_vector,
        limit=20,
        measure=IndexMeasure.l2_distance,
    )

    logging.info(f"Found {len(similar_wallpaper_ids)} similar wallpapers")

    similar_wallpapers = (
        supabase_client.table("wallpapers")
        .select("*")
        .in_("id", similar_wallpaper_ids)
        .execute()
        .data
    )

    logging.info(f"Fetched {len(similar_wallpapers)} similar wallpapers")

    return {"message": "", "data": similar_wallpapers}
