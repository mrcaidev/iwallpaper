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
    similarity_threshold: float = 0.85,
):
    normalized_query = normalize_text(query)
    query_embedding = gte_model.encode(normalized_query, normalize_embeddings=True)

    similarities: pd.Series = embedding_database @ query_embedding

    ranking = (
        similarities[similarities > similarity_threshold]
        .sort_values(ascending=False)
        .index.tolist()
    )
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


def is_query_matched(query: str, target: str):
    query_words = set(query.split())
    return any(query_word in target for query_word in query_words)


def search_test(
    dataset: pd.DataFrame,
    inverted_index: dict[str, list[int]],
    embedding_database: pd.DataFrame,
    query: str,
    top_k: int = 20,
):
    keyword_ranking = keyword_search(inverted_index, query)
    semantic_ranking = semantic_search(
        embedding_database,
        query,
        similarity_threshold=0.83,
    )
    rrf_ranking = reciprocal_rank_fusion(keyword_ranking, semantic_ranking)

    possible_correct_num = len(set().union(keyword_ranking, semantic_ranking))
    expected_correct_num = min(top_k, possible_correct_num)

    keyword_ranking = keyword_ranking[:top_k]
    semantic_ranking = semantic_ranking[:top_k]
    rrf_ranking = rrf_ranking[:top_k]

    keyword_given_num = len(keyword_ranking)
    semantic_given_num = len(semantic_ranking)
    rrf_given_num = len(rrf_ranking)

    normalized_query = normalize_text(query)
    keyword_correct_num = list(
        is_query_matched(normalized_query, str(dataset.loc[id, "content"]))
        for id in keyword_ranking
    ).count(True)
    semantic_correct_num = list(
        is_query_matched(normalized_query, str(dataset.loc[id, "content"]))
        for id in semantic_ranking
    ).count(True)
    rrf_correct_num = list(
        is_query_matched(normalized_query, str(dataset.loc[id, "content"]))
        for id in rrf_ranking
    ).count(True)

    return pd.Series(
        {
            "POS": possible_correct_num,
            "EXP": expected_correct_num,
            "KS_COR": keyword_correct_num,
            "KS_GVN": keyword_given_num,
            "SS_COR": semantic_correct_num,
            "SS_GVN": semantic_given_num,
            "HS_COR": rrf_correct_num,
            "HS_GVN": rrf_given_num,
        },
        dtype=int,
        name=query,
    )


def generate_report(outcome: pd.DataFrame):
    outcome.loc["TOTAL"] = outcome.sum()

    keyword_precision = outcome.loc["TOTAL", "KS_COR"] / outcome.loc["TOTAL", "KS_GVN"]
    keyword_recall = outcome.loc["TOTAL", "KS_COR"] / outcome.loc["TOTAL", "EXP"]
    keyword_f1 = (
        2 * keyword_precision * keyword_recall / (keyword_precision + keyword_recall)
    )

    semantic_precision = outcome.loc["TOTAL", "SS_COR"] / outcome.loc["TOTAL", "SS_GVN"]
    semantic_recall = outcome.loc["TOTAL", "SS_COR"] / outcome.loc["TOTAL", "EXP"]
    semantic_f1 = (
        2
        * semantic_precision
        * semantic_recall
        / (semantic_precision + semantic_recall)
    )

    rrf_precision = outcome.loc["TOTAL", "HS_COR"] / outcome.loc["TOTAL", "HS_GVN"]
    rrf_recall = outcome.loc["TOTAL", "HS_COR"] / outcome.loc["TOTAL", "EXP"]
    rrf_f1 = 2 * rrf_precision * rrf_recall / (rrf_precision + rrf_recall)

    print(outcome)
    print()
    print(f"Keyword Search Precision: {keyword_precision:.2f}")
    print(f"Keyword Search Recall: {keyword_recall:.2f}")
    print(f"Keyword Search F1: {keyword_f1:.2f}")
    print()
    print(f"Semantic Search Precision: {semantic_precision:.2f}")
    print(f"Semantic Search Recall: {semantic_recall:.2f}")
    print(f"Semantic Search F1: {semantic_f1:.2f}")
    print()
    print(f"Hybrid Search Precision: {rrf_precision:.2f}")
    print(f"Hybrid Search Recall: {rrf_recall:.2f}")
    print(f"Hybrid Search F1: {rrf_f1:.2f}")


if __name__ == "__main__":
    dataset = load_dataset("data/ml-latest-small/movies.csv")
    inverted_index = build_inverted_index(dataset)
    embedding_database = build_embedding_database(dataset)

    queries = [
        "toy",
        "father",
        "america",
        "casino",
        "castle",
        "money",
        "star",
        "antonia",
        "twilight",
        "sugar",
    ]

    test_outcome = pd.concat(
        [
            search_test(dataset, inverted_index, embedding_database, query, top_k=30)
            for query in queries
        ],
        axis=1,
    ).T
    generate_report(test_outcome)
