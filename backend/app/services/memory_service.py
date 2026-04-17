
"""
Redis短期对话记忆服务

使用Redis存储对话历史，支持：
- 会话消息存储
- 消息历史检索
- 会话过期自动清理（24小时）
"""
import json
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from app.core.redis import RedisManager
from app.core.config import settings


@dataclass
class ChatMessage:
    """聊天消息"""
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: str  # ISO format datetime

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ChatMessage":
        return cls(**data)


class MemoryService:
    """Redis记忆服务"""

    # Redis Key前缀
    KEY_PREFIX = "chat:session:"
    # 会话过期时间（24小时）
    SESSION_TTL = 24 * 60 * 60
    # 最大历史消息数
    MAX_HISTORY_MESSAGES = 50

    def __init__(self):
        self.redis = None

    async def _get_redis(self):
        """获取Redis客户端"""
        if self.redis is None:
            self.redis = await RedisManager.get_client()
        return self.redis

    def _get_session_key(self, session_id: str) -> str:
        """获取会话的Redis Key"""
        return f"{self.KEY_PREFIX}{session_id}"

    async def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        timestamp: Optional[str] = None
    ):
        """
        添加消息到对话历史

        Args:
            session_id: 会话ID
            role: 消息角色 ("user" | "assistant" | "system")
            content: 消息内容
            timestamp: 时间戳（可选，默认当前时间）
        """
        redis = await self._get_redis()
        key = self._get_session_key(session_id)

        if timestamp is None:
            timestamp = datetime.utcnow().isoformat()

        message = ChatMessage(
            role=role,
            content=content,
            timestamp=timestamp
        )

        # 使用List存储消息
        await redis.rpush(key, json.dumps(message.to_dict()))

        # 限制消息数量
        message_count = await redis.llen(key)
        if message_count > self.MAX_HISTORY_MESSAGES:
            # 删除最早的消息
            await redis.ltrim(key, message_count - self.MAX_HISTORY_MESSAGES, -1)

        # 设置过期时间
        await redis.expire(key, self.SESSION_TTL)

    async def add_user_message(
        self,
        session_id: str,
        content: str,
        timestamp: Optional[str] = None
    ):
        """添加用户消息"""
        await self.add_message(session_id, "user", content, timestamp)

    async def add_assistant_message(
        self,
        session_id: str,
        content: str,
        timestamp: Optional[str] = None
    ):
        """添加助手消息"""
        await self.add_message(session_id, "assistant", content, timestamp)

    async def add_system_message(
        self,
        session_id: str,
        content: str,
        timestamp: Optional[str] = None
    ):
        """添加系统消息"""
        await self.add_message(session_id, "system", content, timestamp)

    async def get_history(
        self,
        session_id: str,
        limit: Optional[int] = None
    ) -> List[ChatMessage]:
        """
        获取对话历史

        Args:
            session_id: 会话ID
            limit: 限制返回的消息数量（可选）

        Returns:
            List[ChatMessage]: 消息列表
        """
        redis = await self._get_redis()
        key = self._get_session_key(session_id)

        if limit is None:
            limit = -1
        else:
            limit = -limit

        messages_data = await redis.lrange(key, limit, -1)

        messages = []
        for msg_data in messages_data:
            try:
                msg_dict = json.loads(msg_data)
                messages.append(ChatMessage.from_dict(msg_dict))
            except (json.JSONDecodeError, TypeError):
                continue

        return messages

    async def get_history_for_llm(
        self,
        session_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        获取格式化的对话历史（用于LLM输入）

        Args:
            session_id: 会话ID
            limit: 限制返回的消息数量（可选）

        Returns:
            List[Dict[str, str]]: 消息列表，格式为 [{"role": "...", "content": "..."}]
        """
        messages = await self.get_history(session_id, limit)
        return [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

    async def clear_history(self, session_id: str):
        """
        清空对话历史

        Args:
            session_id: 会话ID
        """
        redis = await self._get_redis()
        key = self._get_session_key(session_id)
        await redis.delete(key)

    async def session_exists(self, session_id: str) -> bool:
        """
        检查会话是否存在

        Args:
            session_id: 会话ID

        Returns:
            bool: 会话是否存在
        """
        redis = await self._get_redis()
        key = self._get_session_key(session_id)
        exists = await redis.exists(key)
        return exists > 0

    async def get_session_ttl(self, session_id: str) -> Optional[int]:
        """
        获取会话剩余TTL（秒）

        Args:
            session_id: 会话ID

        Returns:
            Optional[int]: 剩余秒数，None表示会话不存在或永不过期
        """
        redis = await self._get_redis()
        key = self._get_session_key(session_id)
        ttl = await redis.ttl(key)
        return ttl if ttl > 0 else None


# 全局MemoryService实例
_memory_service: Optional[MemoryService] = None


def get_memory_service() -> MemoryService:
    """获取MemoryService单例"""
    global _memory_service
    if _memory_service is None:
        _memory_service = MemoryService()
    return _memory_service

