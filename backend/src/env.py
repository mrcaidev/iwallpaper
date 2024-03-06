"""
加载 .env 文件中的环境变量。

该模块应该在项目的其他模块之前被导入，以确保环境变量在其他模块中可用。
"""

import logging

import dotenv

__all__ = []

logger = logging.getLogger(__name__)


def load_env():
    success = dotenv.load_dotenv(verbose=True)

    if success:
        logger.info("Loaded environment variables.")
    else:
        logger.warning("No environment variable found.")


load_env()
