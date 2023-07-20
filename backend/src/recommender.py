import logging
from uuid import UUID

from fastapi import APIRouter
from pydantic import PositiveInt

from .supabase import supabase_client

router = APIRouter(prefix="/recommend")


@router.get("/")
def recommend(user_id: UUID, quantity: PositiveInt = 10):
    wallpapers = (
        supabase_client.rpc(
            "recommend_wallpapers",
            {"user_id": str(user_id), "quantity": quantity},
        )
        .execute()
        .data
    )

    logging.info(f"Recommended {len(wallpapers)} wallpapers to user {user_id}")

    return {"message": "", "data": wallpapers}
