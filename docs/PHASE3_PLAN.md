
# Phase 3 实施计划 - AI问诊核心功能

## 目标
实现AI智能问诊核心功能，包含Gatekeeper意图拦截层、成员档案上下文注入、ModelScope API集成（占位实现）、Redis短期对话记忆。

## 主要任务

### 1. Gatekeeper意图拦截层
**文件**: `backend/app/services/gatekeeper.py`

**功能**:
- 检测并拦截闲聊（非医疗相关问题）
- 检测并阻止Prompt注入攻击
- 检测敏感信息泄露
- 返回友好的拦截响应

**实现要点**:
- 使用关键词匹配 + 简单规则引擎
- 可配置的拦截策略
- 记录拦截日志

### 2. 上下文注入服务
**文件**: `backend/app/services/context_service.py`

**功能**:
- 根据member_id获取成员档案
- 将档案信息格式化为System Prompt
- 支持结构化档案信息注入

**实现要点**:
- 档案信息模板化
- 支持动态更新
- 隐私信息保护

### 3. AI对话服务
**文件**: `backend/app/services/chat_service.py`

**功能**:
- 封装ModelScope API调用
- 兼容OpenAI Chat Completions格式
- Mock实现（当API未配置时）
- 对话历史管理
- System Prompt构建

**实现要点**:
- 支持流式和非流式响应
- 错误重试机制
- Token计数（占位）

### 4. Redis短期记忆
**文件**: `backend/app/services/memory_service.py`

**功能**:
- 使用Redis存储对话历史
- 会话过期管理（24小时）
- 历史消息检索
- 对话摘要生成（占位）

**实现要点**:
- 高效的Redis数据结构
- 自动清理过期会话
- 支持消息分页

### 5. 更新Chat API
**文件**: `backend/app/api/chat.py`

**更新内容**:
- 集成Gatekeeper
- 集成上下文注入
- 集成Redis记忆
- 集成AI对话服务
- 保留Mock实现作为后备

### 6. 前端聊天界面
**文件**: `fortend/src/app/pages/Consult.tsx` 等

**功能**:
- 集成API调用
- 聊天消息展示
- 成员选择
- 会话列表

## 文件结构

```
backend/app/services/
├── __init__.py
├── gatekeeper.py       (新增)
├── context_service.py  (新增)
├── chat_service.py     (新增)
└── memory_service.py   (新增)

llm/
├── README.md           (新增: ModelScope集成说明)
└── prompts/
    └── system_prompt.txt (新增)
```

## 验收标准

1. Gatekeeper能有效拦截闲聊和Prompt注入
2. 成员档案正确注入到对话上下文
3. 对话历史正确存储到Redis
4. AI响应符合家庭医生角色定位
5. 前端聊天界面完整可用
6. Mock模式在无API配置时正常工作

