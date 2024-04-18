import os

from sentence_transformers import SentenceTransformer

from .env import GTE_MODEL_NAME, GTE_MODEL_PATH


def create_gte_model():
    if GTE_MODEL_PATH and os.path.exists(GTE_MODEL_PATH):
        print("Found GTE model in local directory.")
        gte_model = SentenceTransformer(GTE_MODEL_PATH)
        print("Loaded local GTE model.")
        return gte_model

    if GTE_MODEL_NAME:
        print("Downloading GTE model from Hugging Face.")
        gte_model = SentenceTransformer(GTE_MODEL_NAME)
        print("Loaded remote GTE model.")
        return gte_model

    raise Exception("GTE model not found.")


gte_model = create_gte_model()


def create_embedding(sentences: str | list[str]):
    return gte_model.encode(
        sentences,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()
