
"""
上下文注入服务

负责将家庭成员档案信息格式化为System Prompt
"""
from typing import Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.member import Member


def calculate_age(birth_date: Optional[date]) -> Optional[int]:
    """计算年龄"""
    if not birth_date:
        return None
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


class ContextService:
    """上下文服务"""

    @staticmethod
    async def get_member_context(
        db: AsyncSession,
        member_id: int,
        user_id: int
    ) -> Optional[Member]:
        """
        获取成员档案信息

        Args:
            db: 数据库会话
            member_id: 成员ID
            user_id: 用户ID（用于权限验证）

        Returns:
            Member: 成员对象，如果不存在则返回None
        """
        result = await db.execute(
            select(Member).where(
                Member.id == member_id,
                Member.user_id == user_id
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    def format_member_context(member: Member) -> str:
        """
        将成员档案格式化为上下文文本

        Args:
            member: 成员对象

        Returns:
            str: 格式化后的上下文文本
        """
        lines = []
        lines.append("【家庭成员健康档案】")
        lines.append("=" * 40)

        # 基本信息
        lines.append(f"姓名：{member.name}")

        if member.gender:
            lines.append(f"性别：{member.gender}")

        if member.birth_date:
            age = calculate_age(member.birth_date)
            lines.append(f"年龄：{age}岁（出生日期：{member.birth_date}）")
        elif member.relationship == "本人":
            lines.append("年龄：请咨询者提供")

        if member.relationship:
            lines.append(f"关系：{member.relationship}")

        if member.blood_type:
            lines.append(f"血型：{member.blood_type}")

        if member.height:
            lines.append(f"身高：{member.height}cm")

        if member.weight:
            lines.append(f"体重：{member.weight}kg")

        # 健康信息
        if member.allergies and member.allergies.strip():
            lines.append("-" * 40)
            lines.append(f"过敏史：{member.allergies}")

        if member.medical_history and member.medical_history.strip():
            lines.append("-" * 40)
            lines.append(f"既往病史：{member.medical_history}")

        lines.append("=" * 40)
        lines.append("")
        lines.append("请根据以上健康档案信息，为用户提供个性化的健康咨询建议。")
        lines.append("注意：如果档案信息不完整，请在咨询过程中礼貌地询问用户补充。")

        return "\n".join(lines)

    @staticmethod
    def build_system_prompt(
        base_prompt: str,
        member_context: Optional[str] = None
    ) -> str:
        """
        构建完整的System Prompt

        Args:
            base_prompt: 基础System Prompt
            member_context: 成员档案上下文（可选）

        Returns:
            str: 完整的System Prompt
        """
        if not member_context:
            return base_prompt

        # 将档案上下文插入到基础prompt的合适位置
        # 在"角色定位"之前插入档案信息
        insert_pos = base_prompt.find("## 角色定位")
        if insert_pos != -1:
            return (
                base_prompt[:insert_pos] +
                "\n" + member_context + "\n\n" +
                base_prompt[insert_pos:]
            )

        # 如果找不到插入位置，直接追加到末尾
        return base_prompt + "\n\n" + member_context


# 全局ContextService实例
_context_service: Optional[ContextService] = None


def get_context_service() -> ContextService:
    """获取ContextService单例"""
    global _context_service
    if _context_service is None:
        _context_service = ContextService()
    return _context_service

