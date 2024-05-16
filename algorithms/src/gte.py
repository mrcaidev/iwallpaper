import os

from sentence_transformers import SentenceTransformer

from .env import GTE_MODEL_NAME, GTE_MODEL_PATH


def create_gte_model():
    if GTE_MODEL_PATH and os.path.exists(GTE_MODEL_PATH):
        print("Found GTE model in local directory.")
        model = SentenceTransformer(GTE_MODEL_PATH)
        print("Loaded local GTE model.")
        return model

    if GTE_MODEL_NAME:
        print("Downloading GTE model from Hugging Face.")
        model = SentenceTransformer(GTE_MODEL_NAME)
        print("Loaded remote GTE model.")
        return model

    raise Exception("GTE model name or path not found.")


gte_model = create_gte_model()
