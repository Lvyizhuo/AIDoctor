
# AI私人家庭医生项目

一款为每个家庭成员提供专属健康数据管理和私人陪伴式医疗服务的AI小程序。

## 项目结构

```
AIDoctor/
├── backend/           # 后端服务 (FastAPI)
│   ├── app/
│   │   ├── api/      # API路由
│   │   ├── core/     # 核心配置
│   │   ├── models/   # 数据库模型
│   │   ├── schemas/  # Pydantic模式
│   │   ├── services/ # 业务逻辑
│   │   └── utils/    # 工具函数
│   ├── pyproject.toml
│   └── docker-compose.yml
├── fortend/          # 前端小程序 (React + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/       # 页面组件
│   │   │   ├── components/  # UI组件
│   │   │   └── routes.tsx   # 路由配置
│   │   └── styles/
│   └── package.json
├── llm/              # 大模型相关
│   ├── Qwen/         # Qwen模型
│   └── train_data/   # 训练数据
└── docs/             # 文档
    └── PRD/
        └── PRDV6.0.md
```

## 技术栈

### 前端
- React 18
- Vite
- Tailwind CSS
- React Router 7
- Radix UI
- Lucide Icons

### 后端
- Python 3.11+
- FastAPI
- SQLAlchemy 2.0 (异步)
- PostgreSQL
- Redis
- LangChain
- Pydantic v2

### AI模型
- Qwen-1.8B-Chat (LoRA微调)
- ModelScope API

## 快速开始

### 前置要求

- Python 3.11+
- Node.js 18+
- PostgreSQL 16+
- Redis 7+
- conda (推荐)

> 注意：`llm_env.yml` 主要用于模型微调，后端服务请使用 `aidoctor` 环境。

### 1. 启动数据库

```bash
cd backend
docker compose up -d
```

### 2. 启动后端

```bash
cd backend

# 使用conda环境
conda activate aidoctor

# 安装后端依赖（可编辑安装）
pip install -e .

# 复制环境变量
cp .env.example .env

# 确认 DATABASE_URL 与 docker-compose 默认账号一致
# DATABASE_URL=postgresql+asyncpg://aidoc:aidoc123@localhost:5432/aidoc

# 启动服务
python -m app.main
```

后端API文档: http://localhost:8000/docs
后端健康检查: http://localhost:8000/health

### 3. 启动前端

```bash
cd fortend

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env

# 启动开发服务
pnpm dev
```

前端地址: http://localhost:5173

## 功能模块

### 首页 (Home)
- 健康状况展示
- 智能问诊入口
- 健康档案入口
- 今日提醒
- 家庭成员预览

### 档案管理 (Records)
- 家庭成员CRUD
- 健康档案管理
- 体检报告管理

### 问诊中心 (Consult)
- AI智能问诊 ⭐
- 成员档案选择
- 多轮对话
- 多模态支持

### 个人中心 (Profile)
- 用户系统
- 我的问诊
- 用药提醒
- 消息通知

## 开发计划

详见开发计划文档: `/home/lyz-ubuntu/.claude/plans/proud-discovering-toast.md`

### Phase 1: 架构搭建 (当前)
- ✅ 后端FastAPI项目初始化
- ✅ 前端项目配置
- 🔄 数据库表结构创建

### Phase 2-6: 后续阶段
- 用户系统与成员档案
- AI问诊核心功能
- 前端联调与完善
- 健康管理功能
- 测试与上线

## 开发规范

### 后端
- 使用Pydantic v2进行数据验证
- 异步数据库操作
- RESTful API设计
- 统一API响应格式

### 前端
- 组件化开发
- TypeScript类型安全
- Tailwind CSS样式
- 响应式设计

## 许可证

本项目为私有项目。

