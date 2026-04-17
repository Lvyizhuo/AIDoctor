
import redis.asyncio as redis
from typing import Optional
from app.core.config import settings


class RedisManager:
    """Redis管理器"""
    _client: Optional[redis.Redis] = None

    @classmethod
    async def get_client(cls) -> redis.Redis:
        """获取Redis客户端"""
        if cls._client is None:
            cls._client = redis.from_url(
                settings.redis_url,
                password=settings.redis_password,
                decode_responses=True,
            )
        return cls._client

    @classmethod
    async def close(cls):
        """关闭Redis连接"""
        if cls._client is not None:
            await cls._client.close()
            cls._client = None


async def get_redis() -> redis.Redis:
    """获取Redis客户端依赖"""
    return await RedisManager.get_client()

