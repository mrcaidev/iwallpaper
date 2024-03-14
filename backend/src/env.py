"""
将 .env 文件中的环境变量作为常量导出。
"""

import logging
import os

import dotenv

logger = logging.getLogger(__name__)


def load_environment_variables():
    success = dotenv.load_dotenv(verbose=True)

    if success:
        logger.info("Loaded environment variables.")
    else:
        logger.warning("No environment variable found.")


load_environment_variables()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_CONNECTION = os.getenv("SUPABASE_CONNECTION", "")
VECTORIZER_MODEL_NAME = os.getenv("VECTORIZER_MODEL_NAME", "all-MiniLM-L6-v2")
VECTORIZER_MODEL_PATH = os.getenv("VECTORIZER_MODEL_PATH", "./model")
