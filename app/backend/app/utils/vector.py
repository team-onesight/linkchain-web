from sqlalchemy.types import UserDefinedType

# pgvector 타입 정의
class VECTOR(UserDefinedType):
    """
    postgres의 VECTOR 타입을 정의하는 클래스
    init시 차원값(dim)을 받아 vector 클래스 생성
    """
    def __init__(self, dim: int):
        self.dim = dim

    def get_col_spec(self, **kwargs):
        return f"vector({self.dim})"
