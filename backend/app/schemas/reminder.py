
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class ReminderBase(BaseModel):
    """提醒基础信息"""
    title: str
    type: str
    time: str
    repeat: str = "once"
    enabled: bool = True
    member_id: Optional[int] = None


class ReminderCreate(ReminderBase):
    """创建提醒请求"""
    pass


class ReminderUpdate(BaseModel):
    """更新提醒请求"""
    title: Optional[str] = None
    type: Optional[str] = None
    time: Optional[str] = None
    repeat: Optional[str] = None
    enabled: Optional[bool] = None
    member_id: Optional[int] = None


class ReminderInfo(ReminderBase):
    """提醒信息"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ReminderCompleteRequest(BaseModel):
    """标记提醒完成请求"""
    time: str
    date: str


class NotificationInfo(BaseModel):
    """通知信息"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: Optional[str] = None
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    """通知列表响应"""
    notifications: List[NotificationInfo]
    unread_count: int
    has_more: bool

