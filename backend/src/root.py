"""
用于确保应用程序运行状态的端点。
"""

from fastapi import APIRouter

__all__ = ["router"]

router = APIRouter()


@router.get("/")
def hello():
    """
    用于用户确认应用程序是否正在运行。
    """
    return "Hello! The backend is up and running."


@router.get("/healthz")
def check_health():
    """
    用于托管平台检查应用程序运行状态，永远返回 200 OK。
    """
    return
