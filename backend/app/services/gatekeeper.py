
"""
Gatekeeper意图拦截层

负责检测和拦截：
1. 闲聊（非医疗相关问题）
2. Prompt注入攻击
3. 敏感信息泄露
"""
import re
from typing import Tuple, Optional
from dataclasses import dataclass


@dataclass
class GatekeeperResult:
    """Gatekeeper检测结果"""
    allowed: bool
    reason: Optional[str] = None
    suggestion: Optional[str] = None


class Gatekeeper:
    """意图拦截器"""

    # 医疗相关关键词（用于判断是否为医疗问题）
    MEDICAL_KEYWORDS = [
        # 症状
        "痛", "疼", "不舒服", "难受", "痒", "麻", "肿", "胀",
        "发热", "发烧", "感冒", "咳嗽", "流鼻涕", "鼻塞", "打喷嚏",
        "头痛", "头晕", "眩晕", "恶心", "呕吐", "腹泻", "便秘",
        "失眠", "睡眠", "疲劳", "乏力", "虚弱", "出汗", "盗汗",
        "心悸", "心慌", "胸闷", "气短", "呼吸困难",
        # 身体部位
        "头", "眼", "耳", "鼻", "口", "牙", "喉", "颈", "肩",
        "胸", "背", "腰", "腹", "胃", "肠", "肝", "胆", "肾",
        "心", "肺", "脾", "胰", "膀胱", "尿道", "肛门",
        "手", "脚", "腿", "膝", "肘", "腕", "关节",
        "皮肤", "头发", "指甲",
        # 疾病
        "病", "症", "炎", "感染", "过敏", "哮喘", "糖尿病", "高血压",
        "心脏病", "冠心病", "中风", "脑梗", "脑出血", "癌症", "肿瘤",
        "乙肝", "丙肝", "艾滋病", "结核", "肺炎", "胃炎", "肠炎",
        "关节炎", "风湿", "痛风", "甲亢", "甲减", "贫血", "低血糖",
        # 检查
        "检查", "体检", "化验", "抽血", "CT", "X光", "MRI", "B超",
        "心电图", "胃镜", "肠镜",
        # 药物
        "药", "吃药", "服药", "胶囊", "片", "颗粒", "糖浆",
        "抗生素", "消炎药", "止痛药", "退烧药", "降压药", "降糖药",
        # 医疗行为
        "医生", "医院", "挂号", "看病", "就医", "治疗", "手术",
        "康复", "护理", "疗养", "隔离",
        # 健康生活
        "健康", "养生", "保健", "运动", "锻炼", "饮食", "营养",
        "减肥", "增肥", "戒烟", "戒酒",
    ]

    # 闲聊关键词（需要拦截的非医疗话题）
    CHAT_KEYWORDS = [
        "聊天", "闲聊", "谈心", "吐槽", "八卦",
        "天气", "新闻", "股票", "基金", "理财",
        "游戏", "玩", "娱乐", "电影", "电视", "音乐",
        "恋爱", "感情", "婚姻", "家庭",
        "工作", "职场", "老板", "同事",
        "学习", "考试", "作业", "论文",
        "旅游", "旅行", "出去玩",
        "购物", "买买买",
        "你好", "您好", "hi", "hello", "hey",
        "在吗", "忙吗", "有空吗",
        "你是谁", "你叫什么", "介绍一下自己",
    ]

    # Prompt注入检测模式
    PROMPT_INJECTION_PATTERNS = [
        # 经典prompt注入
        r"ignore.*previous.*instructions?",
        r"disregard.*previous.*instructions?",
        r"forget.*previous.*instructions?",
        r"你现在是.*",
        r"假设你是.*",
        r"现在你扮演.*",
        r"请扮演.*",
        r"角色设定.*",
        r"system.*prompt",
        # 指令覆盖
        r"instead.*of.*that",
        r"no.*do.*this",
        r"不要.*要.*",
        r"别.*听.*听我的",
        # 代码执行
        r"execute.*code",
        r"run.*code",
        r"system\(",
        r"import os",
        r"import subprocess",
        r"__import__",
        r"eval\(",
        r"exec\(",
        # 数据泄露
        r"告诉我.*密码",
        r"告诉我.*密钥",
        r"告诉我.*token",
        r"告诉我.*配置",
        r"显示.*环境变量",
        r"输出.*设置",
        # 攻击性内容
        r"生成.*恶意",
        r"怎么.*攻击",
        r"如何.*破解",
        r"如何.*入侵",
    ]

    # 敏感信息检测模式
    SENSITIVE_PATTERNS = [
        r"1[3-9]\d{9}",  # 手机号
        r"\d{17}[\dXx]",  # 身份证号
        r"\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}",  # 银行卡号
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",  # 邮箱
        r"https?://[^\s]+",  # URL（可能包含敏感信息）
    ]

    def __init__(self):
        # 编译正则表达式以提高性能
        self.injection_patterns = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.PROMPT_INJECTION_PATTERNS
        ]
        self.sensitive_patterns = [
            re.compile(pattern)
            for pattern in self.SENSITIVE_PATTERNS
        ]

    def check(self, message: str) -> GatekeeperResult:
        """
        检查用户消息是否允许通过

        Args:
            message: 用户输入的消息

        Returns:
            GatekeeperResult: 检测结果
        """
        # 1. 检查Prompt注入
        injection_result = self._check_prompt_injection(message)
        if not injection_result.allowed:
            return injection_result

        # 2. 检查敏感信息
        sensitive_result = self._check_sensitive_info(message)
        if not sensitive_result.allowed:
            return sensitive_result

        # 3. 检查是否为医疗相关问题
        medical_result = self._check_medical_related(message)
        if not medical_result.allowed:
            return medical_result

        # 通过所有检查
        return GatekeeperResult(allowed=True)

    def _check_prompt_injection(self, message: str) -> GatekeeperResult:
        """检查Prompt注入"""
        for pattern in self.injection_patterns:
            if pattern.search(message):
                return GatekeeperResult(
                    allowed=False,
                    reason="检测到可能的Prompt注入尝试",
                    suggestion="请您专注于健康医疗相关问题的咨询。"
                )
        return GatekeeperResult(allowed=True)

    def _check_sensitive_info(self, message: str) -> GatekeeperResult:
        """检查敏感信息"""
        for pattern in self.sensitive_patterns:
            if pattern.search(message):
                return GatekeeperResult(
                    allowed=False,
                    reason="检测到可能的敏感信息",
                    suggestion="为了保护您的隐私安全，请不要在对话中透露手机号、身份证号、银行卡号等敏感信息。"
                )
        return GatekeeperResult(allowed=True)

    def _check_medical_related(self, message: str) -> GatekeeperResult:
        """检查是否为医疗相关问题"""
        # 如果太短，可能是问候，直接通过（由AI后续引导）
        if len(message.strip()) <= 5:
            return GatekeeperResult(allowed=True)

        # 检查是否包含医疗关键词
        has_medical = any(keyword in message for keyword in self.MEDICAL_KEYWORDS)
        if has_medical:
            return GatekeeperResult(allowed=True)

        # 检查是否包含明确的闲聊关键词
        has_chat = any(keyword in message for keyword in self.CHAT_KEYWORDS)
        if has_chat:
            return GatekeeperResult(
                allowed=False,
                reason="这是一个医疗健康咨询助手",
                suggestion="我是专注于健康医疗咨询的AI助手。请问您有什么健康方面的问题需要咨询吗？"
            )

        # 不确定的情况，允许通过（由AI判断如何回应）
        return GatekeeperResult(allowed=True)


# 全局Gatekeeper实例
_gatekeeper: Optional[Gatekeeper] = None


def get_gatekeeper() -> Gatekeeper:
    """获取Gatekeeper单例"""
    global _gatekeeper
    if _gatekeeper is None:
        _gatekeeper = Gatekeeper()
    return _gatekeeper

