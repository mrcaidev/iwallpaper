"""
加载 SentenceTransformer 模型。
"""

import logging
import os

from sentence_transformers import SentenceTransformer

__all__ = ["transformer"]

logger = logging.getLogger(__name__)


def create_transformer():
    """
    如果本地有模型，就加载本地模型；否则从 Hugging Face 下载模型。
    """
    TRANSFORMER_MODEL_PATH = os.getenv("TRANSFORMER_MODEL_PATH", "./model")
    TRANSFORMER_MODEL_NAME = os.getenv("TRANSFORMER_MODEL_NAME", "all-MiniLM-L6-v2")

    if os.path.exists(TRANSFORMER_MODEL_PATH):
        logger.debug("Found transformer model in local directory.")
        transformer = SentenceTransformer(TRANSFORMER_MODEL_PATH)
        logger.info("Loaded local transformer model.")
        return transformer

    logger.debug("Downloading transformer model from Hugging Face.")
    transformer = SentenceTransformer(TRANSFORMER_MODEL_NAME)
    logger.info("Loaded remote transformer model.")
    return transformer


transformer = create_transformer()
