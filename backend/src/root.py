from fastapi import APIRouter

router = APIRouter()


@router.get("/healthz")
def check_health():
    return {"message": "ok"}
