import time
from collections import defaultdict
from functools import wraps
from typing import Literal

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split


def timeit(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        timer = -time.time()
        result = fn(*args, **kwargs)
        timer += time.time()
        print(f"{fn.__name__} time: {timer:.4f}s.")
        return result

    return wrapper


def build_user_item_matrix(full_set: pd.DataFrame, partial_set: pd.DataFrame):
    index = full_set["userId"].unique()
    columns = full_set["movieId"].unique()
    matrix = pd.DataFrame(index=index, columns=columns, dtype=float).fillna(0)

    for _, row in partial_set.iterrows():
        matrix.loc[row["userId"], row["movieId"]] = row["rating"]

    return matrix.to_numpy()


def build_similarity_matrix(
    user_item_matrix: np.ndarray,
    method: (
        Literal["pure_cosine"] | Literal["correlation"] | Literal["adjusted_cosine"]
    ) = "pure_cosine",
):
    if method == "pure_cosine":
        similarity_matrix = cosine_similarity(user_item_matrix.T)

    elif method == "correlation":
        item_means = user_item_matrix.mean(axis=0).reshape(1, -1)
        centered_user_item_matrix = user_item_matrix - item_means
        similarity_matrix = cosine_similarity(centered_user_item_matrix.T)

    elif method == "adjusted_cosine":
        user_means = user_item_matrix.mean(axis=1).reshape(-1, 1)
        centered_user_item_matrix = user_item_matrix - user_means
        similarity_matrix = cosine_similarity(centered_user_item_matrix.T)

    else:
        raise Exception(f"Unknown similarity computation measure: {method}")

    np.fill_diagonal(similarity_matrix, 0)
    return similarity_matrix


def find_k_most_similar_items(similarity_matrix: np.ndarray, item: int, k: int):
    return np.argsort(similarity_matrix[item])[::-1][:k]


@timeit
def recommend_by_weighted_sum(
    user: int,
    user_item_matrix: np.ndarray,
    similarity_matrix: np.ndarray,
    k_most_similar: int = 20,
):
    predictions = np.zeros(user_item_matrix.shape[1])

    for item in range(user_item_matrix.shape[1]):
        if user_item_matrix[user, item] != 0:
            continue

        k_most_similar_items = find_k_most_similar_items(
            similarity_matrix, item, k_most_similar
        )

        numerator = 0
        denominator = 0

        for similar_item in k_most_similar_items:
            if user_item_matrix[user, similar_item] == 0:
                continue

            similarity = similarity_matrix[item, similar_item]
            rating = user_item_matrix[user, similar_item]

            numerator += similarity * rating
            denominator += similarity

        if denominator != 0:
            predictions[item] = numerator / denominator

    return predictions


def predict_by_weighted_sum(
    user_item_matrix: np.ndarray,
    similarity_matrix: np.ndarray,
    k_most_similar: int = 20,
):
    prediction_matrix = np.zeros_like(user_item_matrix)

    for item in range(user_item_matrix.shape[1]):
        k_most_similar_items = find_k_most_similar_items(
            similarity_matrix, item, k_most_similar
        )

        for user in range(user_item_matrix.shape[0]):
            if user_item_matrix[user, item] != 0:
                continue

            numerator = 0
            denominator = 0

            for similar_item in k_most_similar_items:
                if user_item_matrix[user, similar_item] == 0:
                    continue

                similarity = similarity_matrix[item, similar_item]
                rating = user_item_matrix[user, similar_item]

                numerator += similarity * rating
                denominator += similarity

            if denominator != 0:
                prediction_matrix[user, item] = numerator / denominator

    return prediction_matrix


@timeit
def recommend_by_optimization(
    user: int,
    user_item_matrix: np.ndarray,
    similarity_matrix: np.ndarray,
    k_most_similar: int = 20,
):
    predictions = np.zeros(user_item_matrix.shape[1])

    rated_items = np.where(user_item_matrix[user] != 0)[0]

    scoreboard = defaultdict(lambda: [0, 0])

    for rated_item in rated_items:
        k_most_similar_items = find_k_most_similar_items(
            similarity_matrix, rated_item, k_most_similar
        )

        for similar_item in k_most_similar_items:
            similarity = similarity_matrix[rated_item, similar_item]
            rating = user_item_matrix[user, rated_item]

            scoreboard[similar_item][0] += similarity * rating
            scoreboard[similar_item][1] += similarity

    for item, score in scoreboard.items():
        predictions[item] = score[0] / score[1]

    return predictions


def predict_by_optimization(
    user_item_matrix: np.ndarray,
    similarity_matrix: np.ndarray,
    k_most_similar: int = 20,
):
    prediction_matrix = np.zeros_like(user_item_matrix)

    for user in range(user_item_matrix.shape[0]):
        rated_items = np.where(user_item_matrix[user] != 0)[0]

        scoreboard = defaultdict(lambda: [0, 0])

        for rated_item in rated_items:
            k_most_similar_items = find_k_most_similar_items(
                similarity_matrix, rated_item, k_most_similar
            )

            for similar_item in k_most_similar_items:
                similarity = similarity_matrix[rated_item, similar_item]
                rating = user_item_matrix[user, rated_item]

                scoreboard[similar_item][0] += similarity * rating
                scoreboard[similar_item][1] += similarity

        for item, score in scoreboard.items():
            prediction_matrix[user, item] = score[0] / score[1]

    return prediction_matrix


def evaluate_mae(actual_matrix: np.ndarray, prediction_matrix: np.ndarray):
    mask = actual_matrix != 0
    mae = mean_absolute_error(actual_matrix[mask], prediction_matrix[mask])
    return mae


if __name__ == "__main__":
    dataset = pd.read_csv("data/ml-latest-small/ratings.csv")
    train_set, test_set = train_test_split(dataset, test_size=0.2, random_state=42)

    train_user_item_matrix = build_user_item_matrix(dataset, train_set)
    test_user_item_matrix = build_user_item_matrix(dataset, test_set)

    similarity_matrix = build_similarity_matrix(
        train_user_item_matrix,
        method="adjusted_cosine",
    )

    prediction_matrix = predict_by_weighted_sum(
        train_user_item_matrix,
        similarity_matrix,
        k_most_similar=50,
    )

    mae = evaluate_mae(test_user_item_matrix, prediction_matrix)
    print(f"predict_by_weighted_sum MAE: {mae}.")

    prediction_matrix = predict_by_optimization(
        train_user_item_matrix,
        similarity_matrix,
        k_most_similar=50,
    )

    mae = evaluate_mae(test_user_item_matrix, prediction_matrix)
    print(f"predict_by_optimization MAE: {mae}.")

    recommend_by_weighted_sum(
        1,
        train_user_item_matrix,
        similarity_matrix,
        k_most_similar=50,
    )
    recommend_by_optimization(
        1,
        train_user_item_matrix,
        similarity_matrix,
        k_most_similar=50,
    )
