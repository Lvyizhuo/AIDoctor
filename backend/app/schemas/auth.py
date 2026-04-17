
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class WechatLoginRequest(BaseModel):
    """微信登录请求"""
    code: str


class UserInfo(BaseModel):
    """用户信息"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    openid: str
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime


class AuthResponse(BaseModel):
    """登录响应"""
    token: str
    user: UserInfo


class TokenRefreshRequest(BaseModel):
    """刷新Token请求"""
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    """刷新Token响应"""
    token: str
    expires_at: int

