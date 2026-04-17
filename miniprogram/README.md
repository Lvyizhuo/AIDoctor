# AI家庭医生 - 微信小程序

## 项目结构

```
miniprogram/
├── app.js                 # 小程序入口文件
├── app.json              # 小程序配置文件
├── app.wxss              # 全局样式文件
├── sitemap.json          # 站点地图配置
├── project.config.json   # 项目配置文件
├── api/                  # API接口模块
│   ├── index.js          # API统一导出
│   ├── auth.js           # 认证相关API
│   ├── chat.js           # 聊天相关API
│   ├── members.js        # 成员管理API
│   └── reminders.js      # 提醒管理API
├── utils/                # 工具函数
│   ├── config.js         # 配置文件
│   └── request.js        # 网络请求封装
├── pages/                # 页面文件
│   ├── login/            # 登录页
│   ├── index/            # 首页
│   ├── ai-consult/       # AI问诊页
│   ├── records/          # 健康档案页
│   ├── consult/          # 咨询记录页
│   └── profile/          # 个人中心页
├── components/           # 自定义组件
└── assets/               # 静态资源
    ├── icons/            # 图标文件
    └── images/           # 图片文件
```

## 主要功能

### 1. 登录模块
- 微信一键登录
- 自动登录状态检测
- Token管理

### 2. 首页
- 健康状况展示
- 快捷入口（智能问诊、健康档案）
- 今日提醒
- 家庭成员列表

### 3. AI问诊
- 实时聊天界面
- 图片上传
- 检查报告上传
- 对话历史记录

### 4. 其他页面
- 健康档案：检测报告、就诊记录
- 咨询记录：历史问诊记录
- 个人中心：用户信息、设置、退出登录

## 配置说明

### API基础地址
在 `utils/config.js` 中配置：
```javascript
apiBaseUrl: 'http://localhost:8000/api'
```

### 微信小程序配置
在 `project.config.json` 中配置：
- `appid`: 小程序AppID（开发阶段可使用测试号）

## 开发说明

### 前置条件
1. 微信开发者工具
2. 后端服务运行在 `http://localhost:8000`
3. 微信小程序AppID（或使用测试号）

### 开发步骤
1. 使用微信开发者工具打开 `miniprogram` 目录
2. 配置项目AppID
3. 确保后端服务正常运行
4. 点击编译预览

### 图标资源
需要在 `assets/icons/` 目录下放置以下图标：
- home.png / home-active.png
- records.png / records-active.png
- consult.png / consult-active.png
- profile.png / profile-active.png
- health.png
- wechat.png
- search.png
- chevron-right.png
- chevron-left.png
- stethoscope.png
- activity.png
- pill.png
- person-standing.png
- sparkles.png
- more.png
- close.png
- file-text.png
- mic.png
- plus.png
- users.png
- bell.png
- settings.png
- logout.png
- default-avatar.png

## API对接

小程序已对接后端以下接口：
- POST /api/auth/login - 微信登录
- POST /api/auth/logout - 退出登录
- GET /api/auth/profile - 获取用户信息
- GET /api/members - 获取家庭成员列表
- GET /api/chat/sessions - 获取会话列表
- POST /api/chat/completions - AI对话
- POST /api/chat/upload-report - 上传报告
- GET /api/reminders - 获取提醒列表

## 注意事项

1. 开发阶段 `project.config.json` 中 `urlCheck` 设置为 `false`，可跳过域名校验
2. 生产环境需要在微信公众平台配置合法域名
3. 需要配置服务器域名白名单
4. 图片上传功能需要配置上传域名
