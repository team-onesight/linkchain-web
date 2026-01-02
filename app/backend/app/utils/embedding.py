from typing import List

from sentence_transformers import SentenceTransformer

_model = None


def get_embedding_model():
    """
    embedding 모델 로드 및 반환

    :return: embedding 모델
    :rtype: SentenceTransformer
    """
    global _model
    if _model is None:
        _model = SentenceTransformer("paraphrase-multilingual-mpnet-base-v2")
    return _model


def generate_query_embedding(query: str) -> List[float]:
    """
    embedding 생성

    :param query: 검색어
    :type query: str
    :return: embedding 벡터 ( to List )
    :rtype: List[float]
    """
    model = get_embedding_model()
    embedding = model.encode(query, convert_to_tensor=False)
    return embedding.tolist()
