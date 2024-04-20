import re
from collections import defaultdict

import numpy as np
import pandas as pd

from .gte import gte_model


def normalize_text(text: str):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_dataset(filepath: str):
    dataset = pd.read_csv(filepath, index_col="movieId")
    dataset["content"] = (
        dataset["title"].apply(normalize_text)
        + " "
        + dataset["genres"].apply(normalize_text)
    )
    dataset.drop(columns=["title", "genres"], inplace=True)
    return dataset


def build_inverted_index(dataset: pd.DataFrame):
    inverted_index = defaultdict(list)

    for id, row in dataset.iterrows():
        for word in set(row["content"].split()):
            inverted_index[word].append(id)

    return inverted_index


def keyword_search(
    inverted_index: dict[str, list[int]],
    query: str,
    top_k: int | None = None,
):
    normalized_query = normalize_text(query)
    query_words = set(normalized_query.split())

    scoreboard = defaultdict(float)

    for word in query_words:
        word_ids = inverted_index.get(word, [])
        word_weight = 1 / len(word_ids) if word_ids else 0

        for id in word_ids:
            scoreboard[id] += word_weight

    ranking = sorted(scoreboard.keys(), key=lambda id: (-scoreboard[id], id))
    return ranking[:top_k] if top_k else ranking


def build_embedding_database(dataset: pd.DataFrame):
    matrix = gte_model.encode(dataset["content"].tolist(), normalize_embeddings=True)
    assert isinstance(matrix, np.ndarray)
    return pd.DataFrame(matrix, index=dataset.index)


def semantic_search(
    embedding_database: pd.DataFrame,
    query: str,
    top_k: int | None = None,
):
    normalized_query = normalize_text(query)
    query_embedding = gte_model.encode(normalized_query, normalize_embeddings=True)

    similarities: pd.Series = embedding_database @ query_embedding

    ranking = similarities.sort_values(ascending=False).index.tolist()
    return ranking[:top_k] if top_k else ranking


def reciprocal_rank_fusion(
    *rankings: list[int],
    ranking_weights: list[float] | None = None,
    smoothing_factor: int = 1,
    top_k: int | None = None,
):
    if not ranking_weights:
        ranking_weights = [1.0] * len(rankings)

    assert len(rankings) == len(ranking_weights)

    scoreboard = defaultdict(float)

    for ranking_index, ranking in enumerate(rankings):
        ranking_weight = ranking_weights[ranking_index]
        for rank, id in enumerate(ranking):
            scoreboard[id] += ranking_weight / (smoothing_factor + rank + 1)

    ranking = sorted(scoreboard.keys(), key=lambda id: (-scoreboard[id], id))
    return ranking[:top_k] if top_k else ranking


if __name__ == "__main__":
    dataset = load_dataset("data/ml-latest-small/movies.csv")

    inverted_index = build_inverted_index(dataset)
    keyword_ranking = keyword_search(inverted_index, "toy story", top_k=10)
    print(f"Keyword search result: {keyword_ranking}")

    embedding_database = build_embedding_database(dataset)
    semantic_ranking = semantic_search(embedding_database, "toy story", top_k=10)
    print(f"Semantic search result: {semantic_ranking}")

    rrf_ranking = reciprocal_rank_fusion(keyword_ranking, semantic_ranking, top_k=10)
    print(f"RRF search result: {rrf_ranking}")
