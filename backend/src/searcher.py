import re
from collections import defaultdict

import pandas as pd

from .gte import gte_model


class SearchEngine:
    def __init__(self, dataset_path: str):
        self._load_dataset(dataset_path)
        self._build_inverted_index()
        self._build_embedding_database()

    def _load_dataset(self, filepath: str):
        self.dataset = pd.read_csv(filepath, index_col="movieId")

    @staticmethod
    def _parse_words(text: str):
        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        return set(text.split())

    def _build_inverted_index(self):
        inverted_index = defaultdict(list[int])

        for id, row in self.dataset.iterrows():
            words = SearchEngine._parse_words(row["title"])
            for word in words:
                inverted_index[word].append(id)

        self.inverted_index = inverted_index

    def _build_embedding_database(self):
        sentences = self.dataset["title"].to_list()
        embeddings = gte_model.encode(sentences, normalize_embeddings=True)
        self.embedding_database = pd.DataFrame(embeddings, index=self.dataset.index)

    def _build_ranking(self, name: str, ids: list[int], top_k: int | None = None):
        ids = ids[:top_k] if top_k else ids
        return self.dataset.loc[ids, "title"].rename(name)

    def keyword_search(self, query: str, top_k: int | None = None):
        query_words = SearchEngine._parse_words(query)

        scoreboard = defaultdict(float)

        for word in query_words:
            word_ids = self.inverted_index.get(word, [])
            word_weight = 1 / len(word_ids) if word_ids else 0

            for id in word_ids:
                scoreboard[id] += word_weight

        ids = sorted(scoreboard.keys(), key=lambda id: (-scoreboard[id], id))
        return self._build_ranking("Keyword Search", ids, top_k=top_k)

    def semantic_search(
        self,
        query: str,
        top_k: int | None = None,
        similarity_threshold: float = 0.82,
    ):
        query_embedding = gte_model.encode(query, normalize_embeddings=True)

        similarities: pd.Series = self.embedding_database @ query_embedding

        ids = (
            similarities[similarities > similarity_threshold]
            .sort_values(ascending=False)
            .index.to_list()
        )
        return self._build_ranking("Semantic Search", ids, top_k=top_k)

    def reciprocal_rank_fusion(
        self,
        *rankings: pd.Series,
        top_k: int | None = None,
        ranking_weights: list[float] | None = None,
        smoothing_factor: int = 1,
    ):
        if not ranking_weights:
            ranking_weights = [1.0] * len(rankings)

        assert len(rankings) == len(ranking_weights)

        scoreboard = defaultdict(float)

        for ranking_index, ranking in enumerate(rankings):
            ranking_weight = ranking_weights[ranking_index]
            for rank, id in enumerate(ranking.index):
                scoreboard[id] += ranking_weight / (smoothing_factor + rank + 1)

        ids = sorted(scoreboard.keys(), key=lambda id: (-scoreboard[id], id))
        return self._build_ranking("Hybrid Search", ids, top_k=top_k)

    def generate_report(self, query: str, top_k: int = 30):
        keyword_ranking = self.keyword_search(query)
        semantic_ranking = self.semantic_search(query)

        possible_num = len(set([*keyword_ranking.index, *semantic_ranking.index]))
        expected_num = min(top_k, possible_num)

        keyword_ranking = keyword_ranking[:top_k]
        semantic_ranking = semantic_ranking[:top_k]
        hybrid_ranking = self.reciprocal_rank_fusion(
            keyword_ranking, semantic_ranking, top_k=top_k
        )

        keyword_ranking.reset_index(drop=True, inplace=True)
        semantic_ranking.reset_index(drop=True, inplace=True)
        hybrid_ranking.reset_index(drop=True, inplace=True)

        report = pd.concat([keyword_ranking, semantic_ranking, hybrid_ranking], axis=1)
        report.index += 1

        print(report)
        print(f"Possible correct = {possible_num}, Expected correct = {expected_num}")


if __name__ == "__main__":
    search_engine = SearchEngine("data/ml-latest-small/movies.csv")

    while (query := input(">>> ")) != "q":
        search_engine.generate_report(query)
