import logging
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import PositiveInt
from sklearn.preprocessing import normalize
from vecs import IndexMeasure

from .supabase import preference_collection, supabase_client, tag_collection

router = APIRouter(prefix="/recommend")


@router.get("/")
def recommend(user_id: UUID, quantity: PositiveInt = 10):
    fetch_result = preference_collection.fetch([str(user_id)])

    if len(fetch_result) == 0:
        logging.error(f"User preference vector not found: {user_id}")
        raise HTTPException(404, "User not found")

    _, preference_vector, _ = fetch_result[0]
    preference_vector = normalize([preference_vector])[0]

    logging.info("Fetched user preference vector")

    preferred_wallpaper_ids = tag_collection.query(
        preference_vector,
        limit=quantity,
        measure=IndexMeasure.l2_distance,
    )

    logging.info(f"Found {len(preferred_wallpaper_ids)} preferred wallpapers")

    new_histories = (
        supabase_client.table("histories")
        .upsert(
            [
                {"user_id": str(user_id), "wallpaper_id": wallpaper_id}
                for wallpaper_id in preferred_wallpaper_ids
            ],
            returning="representation",
            ignore_duplicates=True,
            on_conflict="user_id, wallpaper_id",
        )
        .execute()
        .data
    )

    logging.info(
        f"Identified {len(new_histories)}/{len(preferred_wallpaper_ids)} unseen wallpapers"
    )

    recommended_wallpaper_ids = [history["wallpaper_id"] for history in new_histories]

    recommended_wallpapers = (
        supabase_client.table("wallpapers")
        .select("*")
        .in_("id", recommended_wallpaper_ids)
        .execute()
        .data
    )

    logging.info(f"Fetched {len(recommended_wallpapers)} recommended wallpapers")

    return {"message": "", "data": recommended_wallpapers}
