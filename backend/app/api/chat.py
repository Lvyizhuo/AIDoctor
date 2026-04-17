
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid
import os
from app.core.database import get_db
from app.models.chat import ChatSession, ChatMessage as DBChatMessage
from app.models.member import Member
from app.models.user import User
from app.schemas.chat import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatSessionCreate,
    ChatSessionInfo,
    ChatSessionDetail,
)
from app.schemas.common import ApiResponse
from app.core.security import get_current_user
from app.core.config import settings
from app.services import (
    get_gatekeeper,
    get_context_service,
    get_memory_service,
    get_chat_service,
)

router = APIRouter()


def generate_id() -> str:
    """生成唯一ID"""
    return str(uuid.uuid4())


async def get_session_or_404(
    session_id: str,
    user_id: int,
    db: AsyncSession,
) -> ChatSession:
    """获取会话并验证权限"""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会话不存在或无权限访问",
        )

    return session


@router.post("/sessions", response_model=ApiResponse[ChatSessionInfo], status_code=status.HTTP_201_CREATED)
async def create_session(
    request: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """创建问诊会话"""
    # 验证成员存在且属于当前用户
    result = await db.execute(
        select(Member).where(
            Member.id == int(request.member_id),
            Member.user_id == current_user.id
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="成员不存在"
        )

    session_id = generate_id()
    session = ChatSession(
        id=session_id,
        user_id=current_user.id,
        member_id=int(request.member_id),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return ApiResponse(
        data=ChatSessionInfo(
            id=session.id,
            member_id=session.member_id,
            member_name=member.name,
            summary=session.summary,
            created_at=session.created_at,
            updated_at=session.updated_at,
        )
    )


@router.get("/sessions", response_model=ApiResponse[list[ChatSessionInfo]])
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取问诊会话列表"""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
    )
    sessions = result.scalars().all()

    session_list = []
    for session in sessions:
        # 获取成员名称
        member_result = await db.execute(
            select(Member).where(Member.id == session.member_id)
        )
        member = member_result.scalar_one_or_none()
        session_list.append(
            ChatSessionInfo(
                id=session.id,
                member_id=session.member_id,
                member_name=member.name if member else None,
                summary=session.summary,
                created_at=session.created_at,
                updated_at=session.updated_at,
            )
        )

    return ApiResponse(data=session_list)


@router.get("/sessions/{session_id}", response_model=ApiResponse[ChatSessionDetail])
async def get_session_detail(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """获取会话详情"""
    session = await get_session_or_404(session_id, current_user.id, db)

    # 获取成员名称
    member_result = await db.execute(select(Member).where(Member.id == session.member_id))
    member = member_result.scalar_one_or_none()

    # 获取消息列表
    msg_result = await db.execute(
        select(DBChatMessage)
        .where(DBChatMessage.session_id == session_id)
        .order_by(DBChatMessage.created_at)
    )
    messages = msg_result.scalars().all()

    return ApiResponse(
        data=ChatSessionDetail(
            id=session.id,
            member_id=session.member_id,
            member_name=member.name if member else None,
            summary=session.summary,
            created_at=session.created_at,
            updated_at=session.updated_at,
            messages=messages,
        )
    )


@router.post("/completions", response_model=ApiResponse[ChatCompletionResponse])
async def chat_completions(
    request: ChatCompletionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """AI对话（非流式）- 集成Gatekeeper、上下文、记忆和AI服务"""
    # 1. Gatekeeper检查
    gatekeeper = get_gatekeeper()
    gatekeeper_result = gatekeeper.check(request.message)
    if not gatekeeper_result.allowed:
        return ApiResponse(
            code=1001,
            message=gatekeeper_result.reason or "请求被拦截",
            data=ChatCompletionResponse(
                session_id=request.session_id or "",
                message_id="",
                content=gatekeeper_result.suggestion or "请您咨询健康医疗相关问题。",
                created_at=datetime.utcnow(),
            )
        )

    # 2. 验证成员存在
    result = await db.execute(
        select(Member).where(
            Member.id == int(request.member_id),
            Member.user_id == current_user.id
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="成员不存在"
        )

    # 3. 获取或创建会话
    session = None
    if request.session_id:
        session = await get_session_or_404(request.session_id, current_user.id, db)

    if not session:
        # 创建新会话
        session_id = generate_id()
        session = ChatSession(
            id=session_id,
            user_id=current_user.id,
            member_id=int(request.member_id),
        )
        db.add(session)
        await db.flush()
    else:
        session_id = session.id

    # 4. 构建上下文
    context_service = get_context_service()
    member_context = context_service.format_member_context(member)

    # 5. 构建System Prompt
    chat_service = get_chat_service()
    system_prompt = context_service.build_system_prompt(
        chat_service.base_system_prompt,
        member_context
    )

    # 6. 获取对话历史（Redis）
    memory_service = get_memory_service()
    conversation_history = await memory_service.get_history_for_llm(session_id, limit=20)

    # 7. 构建消息并调用AI
    messages = chat_service.build_messages(
        system_prompt=system_prompt,
        conversation_history=conversation_history,
        user_message=request.message
    )

    ai_response = await chat_service.chat_completion(messages)

    # 8. 保存用户消息到数据库
    user_msg_id = generate_id()
    user_msg = DBChatMessage(
        id=user_msg_id,
        session_id=session_id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)

    # 9. 保存AI消息到数据库
    ai_msg_id = generate_id()
    ai_msg = DBChatMessage(
        id=ai_msg_id,
        session_id=session_id,
        role="assistant",
        content=ai_response,
    )
    db.add(ai_msg)

    # 10. 更新会话
    session.updated_at = datetime.utcnow()
    # 简单的摘要生成（取第一条用户消息或AI回复）
    if not session.summary:
        session.summary = request.message[:50] + ("..." if len(request.message) > 50 else "")

    await db.commit()

    # 11. 保存到Redis记忆
    await memory_service.add_user_message(session_id, request.message)
    await memory_service.add_assistant_message(session_id, ai_response)

    return ApiResponse(
        data=ChatCompletionResponse(
            session_id=session_id,
            message_id=ai_msg_id,
            content=ai_response,
            created_at=ai_msg.created_at,
        )
    )


@router.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...),
    member_id: str = Form(None),
    current_user: User = Depends(get_current_user),
):
    """上传检查报告"""
    # 确保上传目录存在
    os.makedirs(settings.upload_dir, exist_ok=True)

    # 生成文件名
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{generate_id()}.{file_ext}"
    file_path = os.path.join(settings.upload_dir, filename)

    # 保存文件
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return ApiResponse(
        data={
            "url": f"/uploads/{filename}",
            "type": "image" if file_ext.lower() in ["jpg", "jpeg", "png", "gif"] else "file",
            "created_at": datetime.utcnow().isoformat(),
        }
    )

