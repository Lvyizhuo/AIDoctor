
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import date
from typing import Optional
from app.core.database import get_db
from app.models.member import Member
from app.models.user import User
from app.schemas.member import MemberCreate, MemberUpdate, MemberInfo, MemberListItem
from app.schemas.common import ApiResponse
from app.core.security import get_current_user

router = APIRouter()


def calculate_age(birth_date: Optional[date]) -> Optional[int]:
    """计算年龄"""
    if not birth_date:
        return None
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


async def get_member_or_404(
    member_id: int,
    user_id: int,
    db: AsyncSession,
) -> Member:
    """获取成员并验证权限"""
    result = await db.execute(
        select(Member).where(Member.id == member_id, Member.user_id == user_id)
    )
    member = result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="成员不存在或无权限访问",
        )

    return member


@router.get("", response_model=ApiResponse[list[MemberListItem]])
async def get_members(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取家庭成员列表"""
    result = await db.execute(
        select(Member).where(Member.user_id == current_user.id)
    )
    members = result.scalars().all()

    # 转换为列表项并计算年龄
    member_list = []
    for member in members:
        member_dict = MemberListItem.model_validate(member).model_dump()
        member_dict["age"] = calculate_age(member.birth_date)
        member_list.append(MemberListItem(**member_dict))

    return ApiResponse(data=member_list)


@router.post("", response_model=ApiResponse[MemberInfo], status_code=status.HTTP_201_CREATED)
async def create_member(
    member_in: MemberCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """添加家庭成员"""
    member = Member(user_id=current_user.id, **member_in.model_dump())
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return ApiResponse(data=MemberInfo.model_validate(member))


@router.get("/self", response_model=ApiResponse[MemberInfo])
async def get_self_member(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取本人档案"""
    result = await db.execute(
        select(Member).where(
            Member.user_id == current_user.id,
            Member.is_self == True
        )
    )
    member = result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="本人档案不存在"
        )

    return ApiResponse(data=MemberInfo.model_validate(member))


@router.get("/{member_id}", response_model=ApiResponse[MemberInfo])
async def get_member(
    member_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取成员详情"""
    member = await get_member_or_404(member_id, current_user.id, db)
    return ApiResponse(data=MemberInfo.model_validate(member))


@router.put("/{member_id}", response_model=ApiResponse[MemberInfo])
async def update_member(
    member_id: int,
    member_in: MemberUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """更新成员信息"""
    member = await get_member_or_404(member_id, current_user.id, db)

    update_data = member_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)

    await db.commit()
    await db.refresh(member)
    return ApiResponse(data=MemberInfo.model_validate(member))


@router.delete("/{member_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def delete_member(
    member_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """删除成员"""
    member = await get_member_or_404(member_id, current_user.id, db)
    await db.delete(member)
    await db.commit()
    return ApiResponse(message="删除成功")

