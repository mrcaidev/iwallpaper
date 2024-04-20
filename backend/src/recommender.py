import os
import time
from collections import defaultdict
from enum import Enum
from functools import wraps

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import mean_absolute_error
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split

sns.set_theme()


def timeit(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        timer = -time.time()
        result = fn(*args, **kwargs)
        timer += time.time()
        print(f"{fn.__name__} time: {timer:.4f}s.")
        return result

    return wrapper


def save_figure(filename: str):
    OUTPUT_DIRNAME = "outputs"

    if not os.path.exists(OUTPUT_DIRNAME):
        os.makedirs(OUTPUT_DIRNAME)

    plt.savefig(os.path.join(OUTPUT_DIRNAME, filename))


def build_user_item_matrix(full_set: pd.DataFrame, partial_set: pd.DataFrame):
    index = full_set["userId"].unique()
    columns = full_set["movieId"].unique()
    matrix = pd.DataFrame(index=index, columns=columns, dtype=float).fillna(0)

    for _, row in partial_set.iterrows():
        matrix.loc[row["userId"], row["movieId"]] = row["rating"]

    return matrix.to_numpy()


class SimilarityMeasure(Enum):
    PURE_COSINE = "Pure Cosine"
    CORRELATION = "Correlation"
    ADJUSTED_COSINE = "Adjusted Cosine"


def build_similarity_matrix(
    user_item_matrix: np.ndarray,
    measure: SimilarityMeasure = SimilarityMeasure.PURE_COSINE,
):
    if measure == SimilarityMeasure.PURE_COSINE:
        similarity_matrix = cosine_similarity(user_item_matrix.T)

    elif measure == SimilarityMeasure.CORRELATION:
        item_means = user_item_matrix.mean(axis=0).reshape(1, -1)
        centered_user_item_matrix = user_item_matrix - item_means
        similarity_matrix = cosine_similarity(centered_user_item_matrix.T)

    elif measure == SimilarityMeasure.ADJUSTED_COSINE:
        user_means = user_item_matrix.mean(axis=1).reshape(-1, 1)
        centered_user_item_matrix = user_item_matrix - user_means
        similarity_matrix = cosine_similarity(centered_user_item_matrix.T)

    else:
        raise Exception(f"Unknown similarity computation measure: {measure}")

    np.fill_diagonal(similarity_matrix, 0)
    return similarity_matrix


def find_k_most_similar_items(similarity_matrix: np.ndarray, item: int, k: int):
    return np.argsort(similarity_matrix[item])[::-1][:k]


@timeit
def traditional_recommend(
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


def traditional_predict(
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
def optimized_recommend(
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


def optimized_predict(
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


def compare_mae_under_different_train_test_ratio(dataset: pd.DataFrame):
    test_sizes = [0.1, 0.2, 0.3, 0.4, 0.5]

    traditional_maes = []
    optimized_maes = []

    for test_size in test_sizes:
        train_set, test_set = train_test_split(
            dataset, test_size=test_size, random_state=42
        )

        train_user_item_matrix = build_user_item_matrix(dataset, train_set)
        test_user_item_matrix = build_user_item_matrix(dataset, test_set)
        similarity_matrix = build_similarity_matrix(
            train_user_item_matrix,
            measure=SimilarityMeasure.ADJUSTED_COSINE,
        )

        traditional_prediction_matrix = traditional_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=50,
        )
        traditional_mae = evaluate_mae(
            test_user_item_matrix,
            traditional_prediction_matrix,
        )
        traditional_maes.append(traditional_mae)

        optimized_prediction_matrix = optimized_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=50,
        )
        optimized_mae = evaluate_mae(
            test_user_item_matrix,
            optimized_prediction_matrix,
        )
        optimized_maes.append(optimized_mae)

    data = pd.DataFrame(
        {
            "Traditional": traditional_maes,
            "Optimized": optimized_maes,
        },
        index=[f"{1 - test_size}/{test_size}" for test_size in test_sizes],
    )
    plt.figure()
    sns.lineplot(data=data, markers=True, dashes=False)
    plt.xlabel("Train/test ratio")
    plt.ylabel("MAE")
    plt.title("Sensitivity of train/test ratio")
    save_figure("sensitivity_of_train_test_ratio.png")


def compare_mae_under_different_similarity_measure(dataset: pd.DataFrame):
    train_set, test_set = train_test_split(dataset, test_size=0.2, random_state=42)
    train_user_item_matrix = build_user_item_matrix(dataset, train_set)
    test_user_item_matrix = build_user_item_matrix(dataset, test_set)

    traditional_maes = []
    optimized_maes = []

    for similarity_measure in SimilarityMeasure:
        similarity_matrix = build_similarity_matrix(
            train_user_item_matrix,
            measure=similarity_measure,
        )

        traditional_prediction_matrix = traditional_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=50,
        )
        traditional_mae = evaluate_mae(
            test_user_item_matrix,
            traditional_prediction_matrix,
        )
        traditional_maes.append(traditional_mae)

        optimized_prediction_matrix = optimized_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=50,
        )
        optimized_mae = evaluate_mae(
            test_user_item_matrix,
            optimized_prediction_matrix,
        )
        optimized_maes.append(optimized_mae)

    data = pd.DataFrame(
        {
            "Measure": [measure.value for measure in SimilarityMeasure],
            "Traditional": traditional_maes,
            "Optimized": optimized_maes,
        },
    ).melt(id_vars="Measure", var_name="Method", value_name="MAE")
    plt.figure()
    sns.barplot(data=data, x="Measure", y="MAE", hue="Method")
    plt.xlabel("Similarity measure")
    plt.ylabel("MAE")
    plt.title("Performance of different similarity measures")
    save_figure("performance_of_different_similarity_measures.png")


def compare_mae_under_different_neighborhood_size(dataset: pd.DataFrame):
    train_set, test_set = train_test_split(dataset, test_size=0.2, random_state=42)
    train_user_item_matrix = build_user_item_matrix(dataset, train_set)
    test_user_item_matrix = build_user_item_matrix(dataset, test_set)
    similarity_matrix = build_similarity_matrix(
        train_user_item_matrix,
        measure=SimilarityMeasure.ADJUSTED_COSINE,
    )

    neighborhood_sizes = [20, 40, 60, 80, 100]

    traditional_maes = []
    optimized_maes = []

    for neighborhood_size in neighborhood_sizes:
        traditional_prediction_matrix = traditional_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=neighborhood_size,
        )
        traditional_mae = evaluate_mae(
            test_user_item_matrix,
            traditional_prediction_matrix,
        )
        traditional_maes.append(traditional_mae)

        optimized_prediction_matrix = optimized_predict(
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=neighborhood_size,
        )
        optimized_mae = evaluate_mae(
            test_user_item_matrix,
            optimized_prediction_matrix,
        )
        optimized_maes.append(optimized_mae)

    data = pd.DataFrame(
        {
            "Traditional": traditional_maes,
            "Optimized": optimized_maes,
        },
        index=neighborhood_sizes,
    )
    plt.figure()
    sns.lineplot(data=data, markers=True, dashes=False)
    plt.xlabel("Neighborhood size")
    plt.ylabel("MAE")
    plt.title("Sensitivity of neighborhood size")
    save_figure("sensitivity_of_neighborhood_size.png")


def compare_time_under_different_neighborhood_size(dataset: pd.DataFrame):
    train_set, _ = train_test_split(dataset, test_size=0.2, random_state=42)
    train_user_item_matrix = build_user_item_matrix(dataset, train_set)
    similarity_matrix = build_similarity_matrix(
        train_user_item_matrix,
        measure=SimilarityMeasure.ADJUSTED_COSINE,
    )

    neighborhood_sizes = [20, 40, 60, 80, 100]

    traditional_times = []
    optimized_times = []

    for neighborhood_size in neighborhood_sizes:
        traditional_time = -time.time()
        traditional_recommend(
            1,
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=neighborhood_size,
        )
        traditional_time += time.time()
        traditional_times.append(traditional_time)

        optimized_time = -time.time()
        optimized_recommend(
            1,
            train_user_item_matrix,
            similarity_matrix,
            k_most_similar=neighborhood_size,
        )
        optimized_time += time.time()
        optimized_times.append(optimized_time)

    data = pd.DataFrame(
        {
            "Traditional": traditional_times,
            "Optimized": optimized_times,
        },
        index=neighborhood_sizes,
    )
    plt.figure()
    sns.lineplot(data=data, markers=True, dashes=False)
    plt.yscale("log")
    plt.xlabel("Neighborhood size")
    plt.ylabel("Time (s)")
    plt.title("Comparison of recommendation time")
    save_figure("comparison_of_recommendation_time.png")


if __name__ == "__main__":
    dataset = pd.read_csv("data/ml-latest-small/ratings.csv")
    compare_time_under_different_neighborhood_size(dataset)
