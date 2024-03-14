"""
加载 .env 文件中的环境变量。
"""

import logging
import os

import dotenv

__all__ = [
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "SUPABASE_CONNECTION",
    "TRANSFORMER_MODEL_NAME",
    "TRANSFORMER_MODEL_PATH",
]

logger = logging.getLogger(__name__)


success = dotenv.load_dotenv(verbose=True)

if success:
    logger.info("Loaded environment variables.")
else:
    logger.warning("No environment variable found.")


SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_CONNECTION = os.getenv("SUPABASE_CONNECTION", "")
TRANSFORMER_MODEL_NAME = os.getenv("TRANSFORMER_MODEL_NAME", "all-MiniLM-L6-v2")
TRANSFORMER_MODEL_PATH = os.getenv("TRANSFORMER_MODEL_PATH", "./model")
