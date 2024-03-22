import logging
import os

from sentence_transformers import SentenceTransformer

from .env import VECTORIZER_MODEL_NAME, VECTORIZER_MODEL_PATH

logger = logging.getLogger(__name__)


def create_vectorizer():
    if os.path.exists(VECTORIZER_MODEL_PATH):
        logger.debug("Found vectorizer model in local directory.")
        vectorizer = SentenceTransformer(VECTORIZER_MODEL_PATH)
        logger.info("Loaded local vectorizer model.")
        return vectorizer

    logger.debug("Downloading vectorizer model from Hugging Face.")
    vectorizer = SentenceTransformer(VECTORIZER_MODEL_NAME)
    logger.info("Loaded remote vectorizer model.")
    return vectorizer


vectorizer = create_vectorizer()
