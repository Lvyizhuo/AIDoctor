
# AI私人家庭医生 - 后端服务

## 项目概述

这是AI私人家庭医生小程序的后端服务，基于FastAPI构建。

## 技术栈

- **框架**: FastAPI
- **数据库**: PostgreSQL + SQLAlchemy 2.0 (异步)
- **缓存**: Redis
- **认证**: JWT
- **AI**: LangChain + ModelScope API
- **部署**: Uvicorn

## 项目结构

```
backend/
├── app/
│   ├── api/              # API路由
│   │   ├── __init__.py
│   │   ├── auth.py       # 认证接口
│   │   ├── members.py    # 家庭成员接口
│   │   ├── chat.py       # AI问诊接口
│   │   ├── reminders.py   # 提醒接口
│   │   └── notifications.py # 通知接口
│   ├── core/             # 核心模块
│   │   ├── __init__.py
│   │   ├── config.py     # 配置
│   │   ├── database.py   # 数据库
│   │   ├── redis.py      # Redis
│   │   └── security.py   # 安全/认证
│   ├── models/           # 数据库模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── member.py
│   │   ├── chat.py
│   │   └── reminder.py
│   ├── schemas/          # Pydantic模式
│   │   ├── __init__.py
│   │   ├── common.py
│   │   ├── auth.py
│   │   ├── member.py
│   │   ├── chat.py
│   │   └── reminder.py
│   ├── services/         # 业务逻辑
│   └── utils/            # 工具函数
├── pyproject.toml
├── .env.example
└── README.md
```

## 快速开始

### 1. 启动依赖服务

```bash
cd backend
docker compose up -d
```

当前 `docker-compose.yml` 使用 `postgres:16-alpine`，请确保本地数据目录与 PostgreSQL 16 兼容。

### 2. 环境配置

```bash
# 复制环境变量配置
cp .env.example .env

# 编辑.env文件，配置数据库和Redis连接
vim .env

# 推荐将 DATABASE_URL 配置为（与 docker-compose 默认账号一致）
# DATABASE_URL=postgresql+asyncpg://aidoc:aidoc123@localhost:5432/aidoc
```

### 3. 安装依赖

```bash
# 使用conda环境（推荐）
conda activate aidoctor

# 使用pip可编辑安装
pip install -e .
```

### 4. 启动服务

```bash
# 开发模式（自动重载）
python -m app.main

# 或使用uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. 访问API

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

## API接口

### 认证模块 (/api/auth)

- `POST /api/auth/login` - 微信登录
- `POST /api/auth/logout` - 退出登录
- `GET /api/auth/profile` - 获取用户信息

### 家庭成员模块 (/api/members)

- `GET /api/members` - 获取家庭成员列表
- `POST /api/members` - 添加家庭成员
- `GET /api/members/self` - 获取本人档案
- `GET /api/members/{id}` - 获取成员详情
- `PUT /api/members/{id}` - 更新成员信息
- `DELETE /api/members/{id}` - 删除成员

### AI问诊模块 (/api/chat)

- `POST /api/chat/sessions` - 创建问诊会话
- `GET /api/chat/sessions` - 获取问诊会话列表
- `GET /api/chat/sessions/{id}` - 获取会话详情
- `POST /api/chat/completions` - AI对话（非流式）
- `POST /api/chat/upload-report` - 上传检查报告

### 提醒模块 (/api/reminders)

- `GET /api/reminders` - 获取提醒列表
- `POST /api/reminders` - 创建提醒
- `PUT /api/reminders/{id}` - 更新提醒
- `DELETE /api/reminders/{id}` - 删除提醒
- `POST /api/reminders/{id}/complete` - 标记提醒已完成

### 通知模块 (/api/notifications)

- `GET /api/notifications` - 获取通知列表
- `PUT /api/notifications/{id}/read` - 标记通知已读

## AI模型配置

当前AI问诊使用Mock实现。待用户提供ModelScope API后，配置以下环境变量：

```env
MODEL_SCOPE_API_KEY=your_api_key
MODEL_SCOPE_ENDPOINT=https://api.modelscope.cn/v1/chat/completions
MODEL_NAME=Qwen-1.8B-Chat
```

## 数据库

使用 PostgreSQL（当前 Docker 镜像版本 16），表结构会在首次启动时自动创建。

## 开发说明

### 添加新的API端点

1. 在 `app/schemas/` 中定义Pydantic模式
2. 在 `app/models/` 中定义数据库模型
3. 在 `app/api/` 中创建路由
4. 在 `app/api/__init__.py` 中包含路由

### 数据库迁移

当前使用SQLAlchemy自动创建表结构，生产环境建议使用Alembic进行迁移管理。

