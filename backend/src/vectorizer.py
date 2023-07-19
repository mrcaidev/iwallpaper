import logging
import os

import joblib
import numpy as np
from scipy.sparse import spmatrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize

from .constants import MODEL_DIR


class Vectorizer:
    def __init__(self, vector_length=1000, model_name="vectorizer"):
        self._vector_length = vector_length
        self._model_path = os.path.join(MODEL_DIR, f"{model_name}.joblib")

        if os.path.exists(self._model_path):
            self._load_model()
        else:
            self._create_model()

    def train(self, corpus: list[str]):
        X = self._vectorizer.fit_transform(corpus)
        self._save_model()
        return self._postprocess(X)

    def predict(self, corpus: list[str]):
        X = self._vectorizer.transform(corpus)
        return self._postprocess(X)

    def _create_model(self):
        self._vectorizer = TfidfVectorizer(max_features=self._vector_length)
        logging.info(f"Created vectorizer model")

    def _load_model(self):
        self._vectorizer: TfidfVectorizer = joblib.load(self._model_path)
        logging.info(f"Loaded vectorizer model from {self._model_path}")

    def _save_model(self):
        joblib.dump(self._vectorizer, self._model_path)
        logging.info(f"Saved vectorizer model to {self._model_path}")

    def _postprocess(self, matrix: spmatrix):
        vectors = matrix.toarray()
        vectors = normalize(vectors)
        vectors = Vectorizer._pad_right(vectors, self._vector_length)
        return vectors.tolist()

    @staticmethod
    def _pad_right(vectors: np.ndarray, length: int):
        padding = max(0, length - vectors.shape[1])
        return np.pad(vectors, ((0, 0), (0, padding)))


vectorizer = Vectorizer(vector_length=2000)
