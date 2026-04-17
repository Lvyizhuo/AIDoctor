
"""
AI对话服务

封装ModelScope API调用，支持：
- ModelScope API集成（兼容OpenAI格式）
- Mock实现（当API未配置时）
- 对话历史管理
- System Prompt构建
"""
import os
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings


class ChatService:
    """AI对话服务"""

    def __init__(self):
        self._load_system_prompt()

    def _load_system_prompt(self):
        """加载System Prompt"""
        # 尝试从文件加载
        prompt_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "llm",
            "prompts",
            "system_prompt.txt"
        )

        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                self.base_system_prompt = f.read()
        else:
            # 使用默认Prompt
            self.base_system_prompt = """你是一位专业、贴心的家庭医生AI助手，名为"AI家庭医生"。你的职责是为用户提供专业的医疗健康咨询服务。"""

    def is_api_configured(self) -> bool:
        """检查ModelScope API是否已配置"""
        return bool(settings.model_scope_api_key and settings.model_scope_endpoint)

    def build_messages(
        self,
        system_prompt: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        user_message: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        构建消息列表

        Args:
            system_prompt: System Prompt
            conversation_history: 对话历史
            user_message: 当前用户消息

        Returns:
            List[Dict[str, str]]: 消息列表
        """
        messages = []

        # 添加System Prompt
        messages.append({"role": "system", "content": system_prompt})

        # 添加对话历史
        if conversation_history:
            messages.extend(conversation_history)

        # 添加当前用户消息
        if user_message:
            messages.append({"role": "user", "content": user_message})

        return messages

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        调用AI模型获取回复

        Args:
            messages: 消息列表
            temperature: 温度参数
            max_tokens: 最大Token数

        Returns:
            str: AI回复内容
        """
        if self.is_api_configured():
            return await self._call_modelscope_api(messages, temperature, max_tokens)
        else:
            return self._get_mock_response(messages)

    async def _call_modelscope_api(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        调用ModelScope API

        Args:
            messages: 消息列表
            temperature: 温度参数
            max_tokens: 最大Token数

        Returns:
            str: AI回复内容
        """
        url = settings.model_scope_endpoint
        api_key = settings.model_scope_api_key

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": settings.model_name,
            "messages": messages,
            "temperature": temperature if temperature is not None else settings.model_temperature,
            "max_tokens": max_tokens if max_tokens is not None else settings.model_max_tokens
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()

            # 解析OpenAI格式响应
            if "choices" in result and len(result["choices"]) > 0:
                choice = result["choices"][0]
                if "message" in choice:
                    return choice["message"].get("content", "")
                elif "text" in choice:
                    return choice["text"]

            return ""

    def _get_mock_response(self, messages: List[Dict[str, str]]) -> str:
        """
        获取Mock响应（用于开发测试）

        Args:
            messages: 消息列表

        Returns:
            str: Mock回复内容
        """
        # 获取最后一条用户消息
        user_message = ""
        for msg in reversed(messages):
            if msg["role"] == "user":
                user_message = msg["content"]
                break

        # 简单的规则-based Mock响应
        if not user_message or len(user_message.strip()) <= 2:
            return "您好！我是您的AI家庭医生。请问您有什么健康方面的问题需要咨询吗？"

        # 症状相关问题
        symptom_keywords = ["痛", "疼", "不舒服", "难受", "痒", "麻", "肿", "胀", "发热", "发烧", "感冒", "咳嗽"]
        if any(keyword in user_message for keyword in symptom_keywords):
            return (
                "很抱歉听到您身体不适。为了更好地帮助您，我需要了解一些信息：\n\n"
                "1. 这种症状持续多久了？\n"
                "2. 有没有其他伴随症状？\n"
                "3. 最近有没有受凉、劳累或饮食不当？\n\n"
                "请您提供更多信息，我会尽力为您提供建议。"
            )

        # 用药相关问题
        drug_keywords = ["药", "吃药", "服药", "用什么药"]
        if any(keyword in user_message for keyword in drug_keywords):
            return (
                "关于用药建议，我需要提醒您：\n\n"
                "我不能直接为您开具处方药物。如果您需要用药建议，建议您：\n"
                "1. 先咨询专业医生或药师\n"
                "2. 详细描述您的症状和病史\n"
                "3. 告知医生您正在服用的其他药物\n\n"
                "请问您具体有哪些症状呢？我可以为您提供一些非药物治疗的建议。"
            )

        # 就医相关问题
        hospital_keywords = ["医院", "挂号", "看医生", "就医", "检查"]
        if any(keyword in user_message for keyword in hospital_keywords):
            return (
                "如果您考虑就医，以下是一些建议：\n\n"
                "1. 根据您的症状选择合适的科室\n"
                "2. 准备好您的病史资料\n"
                "3. 记录您的症状变化情况\n\n"
                "请问您具体有哪些症状？我可以帮您判断是否需要及时就医。"
            )

        # 默认响应
        return (
            "感谢您的咨询。我是您的AI家庭医生助手。\n\n"
            "请问您具体有哪些健康方面的问题？我会尽力为您提供专业的建议。"
            "如果您有任何症状不适，请告诉我详细情况。"
        )


# 全局ChatService实例
_chat_service: Optional[ChatService] = None


def get_chat_service() -> ChatService:
    """获取ChatService单例"""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service

