
from pydantic import BaseModel, ConfigDict
from typing import Optional, Generic, TypeVar

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """通用API响应"""
    code: int = 0
    message: str = "success"
    data: Optional[T] = None


class PaginationParams(BaseModel):
    """分页参数"""
    limit: int = 20
    offset: int = 0

