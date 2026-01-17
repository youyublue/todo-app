# Todo App

一个功能齐全、现代化的待办事项应用，基于 React、TypeScript 和 Supabase 构建。

![Todo App](https://img.shields.io/badge/React-19-20232A?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.39-3ECF8E?style=flat&logo=supabase)

## ✨ 主要功能

### 🎯 任务管理
- **快速添加**：主输入框快速创建任务，支持符号识别（`!` 高优先级，`#` 分类）
- **原地编辑**：双击任务标题、描述即可编辑，无需弹窗
- **智能分组**：收件箱、今天、即将到来、重要任务
- **优先级**：低、中、高三个级别，颜色区分
- **截止日期**：日期选择器，过期任务红色提醒

### 🏷️ 分类系统
- **10 种预设颜色**：快速选择，视觉化展示
- **分类管理**：创建、删除、编辑分类
- **颜色标识**：每个分类有独立颜色

### 👤 用户认证
- **邮箱注册**：完整的表单验证（格式、长度、确认）
- **邮箱重复检测**：注册前检查邮箱是否已存在
- **自动登录**：注册成功后自动登录
- **密码管理**：设置页面修改密码

### 🌐 国际化
- **多语言支持**：简体中文、English
- **即时切换**：设置页面实时切换语言
- **持久化**：语言偏好保存到数据库

### 🌓 主题
- **深色模式**：完整的深色主题支持
- **一键切换**：侧边栏快速切换主题
- **持久化**：主题偏好保存

### 🔄 实时同步
- **多设备同步**：基于 Supabase Realtime
- **即时更新**：修改立即反映到所有设备
- **乐观更新**：操作立即生效，失败自动回滚

### 📱 响应式设计
- **移动端优化**：完美适配手机和平板
- **触摸友好**：所有交互都支持触摸操作

## 🛠️ 技术栈

### 前端
- **框架**：React 19 + TypeScript
- **构建工具**：Vite
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **日期处理**：date-fns

### 后端
- **数据库**：Supabase PostgreSQL
- **认证**：Supabase Auth
- **实时**：Supabase Realtime
- **Row Level Security**：数据库级别的访问控制

### 部署
- **主机**：Cloudflare Pages
- **域名**：todo.youyublue.top
- **CI/CD**：GitHub 自动部署

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Supabase 账号

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/youyublue/todo-app.git
   cd todo-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env` 文件：
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **设置数据库**

   在 Supabase Dashboard 的 SQL Editor 中运行 `supabase_schema.sql`

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问 http://localhost:5173

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── account/        # 账户设置
│   ├── auth/           # 认证组件
│   ├── categories/     # 分类管理
│   ├── layout/         # 布局组件
│   ├── todos/          # 任务相关
│   └── ui/             # UI 基础组件
├── contexts/           # React Context
├── hooks/              # 自定义 Hooks
│   ├── useTodos.ts     # 任务管理
│   ├── useCategories.ts # 分类管理
│   └── useProfile.ts   # 用户资料
├── lib/                # 工具函数
│   ├── supabase.ts     # Supabase 客户端
│   ├── utils.ts        # 通用工具
│   └── i18n.ts         # 国际化
├── pages/              # 页面组件
│   ├── DashboardPage.tsx
│   ├── TodayPage.tsx
│   ├── UpcomingPage.tsx
│   ├── ImportantPage.tsx
│   ├── StatsPage.tsx
│   └── SettingsPage.tsx
└── types/              # TypeScript 类型定义
```

## 📚 文档

- **[功能文档](FEATURES.md)** - 详细的功能说明和需求
- **[开发文档](CLAUDE.md)** - 架构概述和开发指南
- **[部署文档](DEPLOYMENT.md)** - 部署到 Cloudflare Pages

## 🎨 UI/UX 特性

### 动画效果
- ✅ 任务进入：淡入动画
- ✅ 任务删除：淡出动画
- ✅ 任务完成：弹跳动画
- ✅ 列表加载：滑入动画 + 错峰延迟

### 交互设计
- ✅ 原地编辑：双击标题、描述编辑
- ✅ 点击切换：优先级、分类、日期
- ✅ 悬停提示：仅在鼠标悬停时显示
- ✅ 键盘快捷键：Enter 保存，Esc 取消

### 视觉反馈
- ✅ 过期任务：红色日期显示
- ✅ 优先级颜色：蓝、黄、红
- ✅ 已完成：删除线 + 透明度
- ✅ 分类颜色：10 种预设颜色

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 ESLint
npm run lint
```

## 🚢 部署

项目使用 Cloudflare Pages 自动部署：

1. 推送代码到 GitHub main 分支
2. Cloudflare Pages 自动触发构建
3. 构建完成后自动部署到生产环境

**生产环境**：https://todo.youyublue.top

详细部署步骤请参考 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🗄️ 数据库架构

### 主要表

- **profiles**：用户资料（用户名、语言、主题偏好）
- **todos**：任务（标题、描述、优先级、状态、截止日期）
- **categories**：分类（名称、颜色）
- **recurring_tasks**：周期性任务配置

### 安全性

- **Row Level Security (RLS)**：所有表都有 RLS 策略
- **用户隔离**：每个用户只能访问自己的数据
- **会话管理**：Supabase Auth 处理认证

## 🔐 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

⚠️ **注意**：不要将 `.env` 文件提交到 git！

## 🐛 已知问题

- [ ] 浏览器日期选择器在某些浏览器中样式不一致
- [ ] 移动端长按任务无法显示上下文菜单

## 📈 未来计划

- [ ] 任务搜索功能
- [ ] 任务拖拽排序
- [ ] 子任务支持
- [ ] 文件附件
- [ ] 任务协作（共享任务）
- [ ] 浏览器通知提醒
- [ ] 导出功能（PDF、CSV）
- [ ] 移动应用（React Native）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

youyublue

## 🙏 致谢

- [Supabase](https://supabase.com) - 后端服务
- [Vite](https://vitejs.dev) - 构建工具
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [Lucide](https://lucide.dev) - 图标库

---

**最后更新**：2025-01-17
