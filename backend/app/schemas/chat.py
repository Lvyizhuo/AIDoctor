
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class Attachment(BaseModel):
    """附件"""
    type: str
    url: str


class ChatCompletionRequest(BaseModel):
    """AI对话请求"""
    session_id: Optional[str] = None
    member_id: str
    message: str
    attachments: Optional[List[Attachment]] = None


class ChatMessageInfo(BaseModel):
    """聊天消息"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str
    created_at: datetime


class ChatCompletionResponse(BaseModel):
    """AI对话响应"""
    session_id: str
    message_id: str
    content: str
    created_at: datetime


class ChatSessionCreate(BaseModel):
    """创建会话请求"""
    member_id: str


class ChatSessionInfo(BaseModel):
    """会话信息"""
    model_config = ConfigDict(from_attributes=True)

    id: str
    member_id: int
    member_name: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ChatSessionDetail(ChatSessionInfo):
    """会话详情"""
    messages: List[ChatMessageInfo]

