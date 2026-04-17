
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime


class MemberBase(BaseModel):
    """成员基础信息"""
    name: str
    avatar_url: Optional[str] = None
    relationship: str
    gender: Optional[str] = None
    birth_date: Optional[date] = None
    blood_type: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    is_self: bool = False


class MemberCreate(MemberBase):
    """创建成员请求"""
    pass


class MemberUpdate(BaseModel):
    """更新成员请求"""
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    relationship: Optional[str] = None
    gender: Optional[str] = None
    birth_date: Optional[date] = None
    blood_type: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    is_self: Optional[bool] = None


class MemberInfo(MemberBase):
    """成员信息响应"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class MemberListItem(BaseModel):
    """成员列表项"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    avatar_url: Optional[str] = None
    relationship: str
    age: Optional[int] = None
    gender: Optional[str] = None
    is_self: bool
    created_at: datetime

