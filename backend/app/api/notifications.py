
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.reminder import Notification
from app.models.user import User
from app.schemas.reminder import NotificationInfo, NotificationListResponse
from app.schemas.common import ApiResponse
from app.core.security import get_current_user

router = APIRouter()


async def get_notification_or_404(
    notification_id: int,
    user_id: int,
    db: AsyncSession,
) -> Notification:
    """获取通知并验证权限"""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
    )
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知不存在或无权限访问",
        )

    return notification


@router.get("", response_model=ApiResponse[NotificationListResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取通知列表"""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications = result.scalars().all()

    # 计算未读数量
    unread_result = await db.execute(
        select(func.count(Notification.id))
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
    )
    unread_count = unread_result.scalar() or 0

    return ApiResponse(
        data=NotificationListResponse(
            notifications=[NotificationInfo.model_validate(n) for n in notifications],
            unread_count=unread_count,
            has_more=False,
        )
    )


@router.put("/{notification_id}/read", response_model=ApiResponse)
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """标记通知已读"""
    notification = await get_notification_or_404(notification_id, current_user.id, db)
    notification.is_read = True
    await db.commit()
    return ApiResponse()

