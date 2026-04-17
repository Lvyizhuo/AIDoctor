
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.core.database import get_db
from app.models.reminder import Reminder
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderInfo, ReminderCompleteRequest
from app.schemas.common import ApiResponse
from app.core.security import get_current_user

router = APIRouter()


async def get_reminder_or_404(
    reminder_id: int,
    user_id: int,
    db: AsyncSession,
) -> Reminder:
    """获取提醒并验证权限"""
    result = await db.execute(
        select(Reminder).where(
            Reminder.id == reminder_id,
            Reminder.user_id == user_id
        )
    )
    reminder = result.scalar_one_or_none()

    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="提醒不存在或无权限访问",
        )

    return reminder


@router.get("", response_model=ApiResponse[list[ReminderInfo]])
async def get_reminders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取提醒列表"""
    result = await db.execute(
        select(Reminder)
        .where(Reminder.user_id == current_user.id)
        .order_by(Reminder.created_at.desc())
    )
    reminders = result.scalars().all()
    return ApiResponse(data=[ReminderInfo.model_validate(r) for r in reminders])


@router.post("", response_model=ApiResponse[ReminderInfo], status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_in: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """创建提醒"""
    reminder = Reminder(user_id=current_user.id, **reminder_in.model_dump())
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return ApiResponse(data=ReminderInfo.model_validate(reminder))


@router.put("/{reminder_id}", response_model=ApiResponse[ReminderInfo])
async def update_reminder(
    reminder_id: int,
    reminder_in: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """更新提醒"""
    reminder = await get_reminder_or_404(reminder_id, current_user.id, db)

    update_data = reminder_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reminder, field, value)

    await db.commit()
    await db.refresh(reminder)
    return ApiResponse(data=ReminderInfo.model_validate(reminder))


@router.delete("/{reminder_id}", response_model=ApiResponse)
async def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """删除提醒"""
    reminder = await get_reminder_or_404(reminder_id, current_user.id, db)
    await db.delete(reminder)
    await db.commit()
    return ApiResponse(message="删除成功")


@router.post("/{reminder_id}/complete", response_model=ApiResponse)
async def complete_reminder(
    reminder_id: int,
    request: ReminderCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """标记提醒已完成"""
    # TODO: 实现完成记录逻辑
    reminder = await get_reminder_or_404(reminder_id, current_user.id, db)
    return ApiResponse(message="标记成功")

