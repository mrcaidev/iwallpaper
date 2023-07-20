import logging
from typing import Annotated

from fastapi import APIRouter, Query

from .supabase import supabase_client
from .vectorizer import vectorizer

router = APIRouter(prefix="/search")


@router.get("/")
def search(query: Annotated[str, Query(min_length=1, max_length=50)]):
    query_vector = vectorizer.transform([query])[0]

    wallpapers = (
        supabase_client.rpc("search_wallpapers", {"query": query_vector}).execute().data
    )

    logging.info(f"Found {len(wallpapers)} search results for: {query}")

    return {"message": "", "data": wallpapers}
