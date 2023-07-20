import logging
import os

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

from .constants import MODEL_DIR


class Vectorizer:
    def __init__(self, max_features=1000, model_name="vectorizer"):
        self._max_features = max_features
        self._model_path = os.path.join(MODEL_DIR, f"{model_name}.joblib")

        if self._has_model():
            self._load_model()
        else:
            self._create_model()

    def fit_transform(self, corpus: list[str]):
        X = self._vectorizer.fit_transform(corpus)
        self._save_model()
        return X.toarray().tolist()

    def transform(self, corpus: list[str]):
        X = self._vectorizer.transform(corpus)
        return X.toarray().tolist()

    def _has_model(self):
        return os.path.exists(self._model_path)

    def _create_model(self):
        self._vectorizer = TfidfVectorizer(max_features=self._max_features)
        logging.info(f"Created vectorizer model")

    def _load_model(self):
        self._vectorizer: TfidfVectorizer = joblib.load(self._model_path)
        logging.info(f"Loaded vectorizer model from {self._model_path}")

    def _save_model(self):
        joblib.dump(self._vectorizer, self._model_path)
        logging.info(f"Saved vectorizer model to {self._model_path}")


vectorizer = Vectorizer(max_features=2000)
