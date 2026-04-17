
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import WechatLoginRequest, AuthResponse, UserInfo
from app.schemas.common import ApiResponse
from app.core.security import create_access_token, get_current_user
import httpx

router = APIRouter()


class WeChatService:
    """微信服务"""

    @staticmethod
    async def code2session(code: str) -> dict:
        """
        调用微信code2session接口获取openid

        返回:
            {
                "openid": "用户唯一标识",
                "session_key": "会话密钥",
                "unionid": "用户在开放平台的唯一标识符",
                "errcode": 错误码,
                "errmsg": 错误信息
            }
        """
        if not settings.wechat_app_id or not settings.wechat_app_secret:
            # 如果没有配置微信凭证，使用Mock
            return {
                "openid": f"mock_openid_{code}",
                "session_key": "mock_session_key",
            }

        url = "https://api.weixin.qq.com/sns/jscode2session"
        params = {
            "appid": settings.wechat_app_id,
            "secret": settings.wechat_app_secret,
            "js_code": code,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            result = response.json()

            if "errcode" in result and result["errcode"] != 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"微信登录失败: {result.get('errmsg', '未知错误')}",
                )

            return result


@router.post("/login", response_model=ApiResponse[AuthResponse])
async def wechat_login(
    request: WechatLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """微信登录"""
    # 调用微信API获取openid
    wx_result = await WeChatService.code2session(request.code)
    openid = wx_result["openid"]

    # 查询或创建用户
    result = await db.execute(select(User).where(User.openid == openid))
    user = result.scalar_one_or_none()

    if not user:
        user = User(openid=openid, nickname="微信用户")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # 创建Token
    access_token = create_access_token({"sub": str(user.id)})

    return ApiResponse(
        data=AuthResponse(
            token=access_token,
            user=UserInfo.model_validate(user),
        )
    )


@router.post("/logout", response_model=ApiResponse)
async def logout(
    current_user: User = Depends(get_current_user),
):
    """退出登录"""
    # TODO: 如果需要，可以将Token加入黑名单
    return ApiResponse(message="退出成功")


@router.get("/profile", response_model=ApiResponse[UserInfo])
async def get_profile(
    current_user: User = Depends(get_current_user),
):
    """获取当前用户信息"""
    return ApiResponse(data=UserInfo.model_validate(current_user))

