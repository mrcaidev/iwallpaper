from fastapi import APIRouter

__all__ = ["router"]

router = APIRouter()


@router.get("/")
def hello():
    return "Hello! The backend is up and running."


@router.get("/healthz")
def check_health():
    return
