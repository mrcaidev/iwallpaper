import logging
import os

from sentence_transformers import SentenceTransformer

from .env import GTE_MODEL_NAME, GTE_MODEL_PATH

logger = logging.getLogger(__name__)


def create_gte_model():
    if os.path.exists(GTE_MODEL_PATH):
        logger.debug("Found GTE model in local directory.")
        gte_model = SentenceTransformer(GTE_MODEL_PATH)
        logger.info("Loaded local GTE model.")
        return gte_model

    logger.debug("Downloading GTE model from Hugging Face.")
    gte_model = SentenceTransformer(GTE_MODEL_NAME)
    logger.info("Loaded remote GTE model.")
    return gte_model


gte_model = create_gte_model()


def create_embedding(sentences: str | list[str]):
    return gte_model.encode(
        sentences,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()
