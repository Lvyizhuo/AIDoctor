
from fastapi import APIRouter
from app.api import auth, members, chat, reminders, notifications

router = APIRouter()

# 包含各模块路由
router.include_router(auth.router, prefix="/auth", tags=["认证"])
router.include_router(members.router, prefix="/members", tags=["家庭成员"])
router.include_router(chat.router, prefix="/chat", tags=["AI问诊"])
router.include_router(reminders.router, prefix="/reminders", tags=["提醒"])
router.include_router(notifications.router, prefix="/notifications", tags=["通知"])

