# 📚 Blog-FE - 现代化个人博客前端

一个基于 **React 19 + TypeScript** 构建的现代化个人博客平台。当前处于 MVP 阶段，围绕博客浏览、文章管理、评论交互、认证和后台管理持续演进，并逐步接入真实后端 API 与 ShadcnUI 组件体系。

## ✨ 核心功能

### 🌐 博客浏览模块
- 📖 **首页展示** - 分页显示所有文章卡片
- 📚 **全部文章页** - 从导航栏进入查看所有文章列表，支持按文章标签分类筛选
- 📄 **文章详情** - 完整展示文章内容、作者、发布日期和标签
- 🎨 **主题切换** - 支持深色/浅色主题，实时切换且自动保存到本地

### 📝 博客管理模块
- ➕ **创建文章** - 完整的表单界面，支持标题、作者、摘要、内容、标签
- ✏️ **编辑文章** - 修改现有文章内容
- 🗑️ **删除文章** - 管理后台一键删除
- 📊 **仪表板** - 实时显示文章总数、最后更新时间、标签统计

### 🔐 认证与账号模块
- 👤 **登录 / 注册** - 支持弹窗式登录注册交互
- 🧭 **登录态管理** - 基于 Zustand 保存认证状态
- 🛡️ **路由守卫** - 后续将逐步补齐受保护路由和角色限制

### 💬 评论系统
- 📝 **发表评论** - 仅需输入评论内容（无需名字、邮箱）
- 💭 **评论回复** - 支持对评论进行回复（嵌套评论）
- 👍 **点赞/踩评论** - 参考B站设计，支持评论维度的点赞和踩，重复点击可取消，并高亮当前选中的状态
- 📋 **回复列表** - 若有多条回复，可点击"X条回复"查看所有回复
- 🎯 **回复详情页** - 点进回复后，展示原评论和所有回复，支持继续回复回复
- 💾 **本地存储** - 评论、回复、点赞数据存储在浏览器 localStorage（可后续集成后端 API）

## 🏗️ 项目结构

```
src/
├── components/          # 少量全局通用组件
│   ├── Footer.tsx       # 页脚组件
│   ├── Header.tsx       # 头部导航栏
│   └── ThemeProvider.tsx # 主题提供器
├── features/            # 按业务域组织的可复用组件
│   ├── account/
│   │   └── components/
│   │       └── AvatarUpload.tsx # 头像上传
│   ├── auth/
│   │   └── components/
│   │       └── LoginPopover.tsx # 登录/注册弹窗
│   ├── articles/
│   │   └── components/
│   │       ├── ArticleForm.tsx  # 文章表单（新建/编辑）
│   │       └── PostCard.tsx     # 文章卡片
│   ├── comments/
│   │   └── components/
│   │       ├── CommentForm.tsx  # 评论表单
│   │       ├── CommentCard.tsx  # 评论卡片（含点赞/踩/回复按钮）
│   │       ├── CommentList.tsx  # 评论列表
│   │       └── CommentManagement.tsx # 评论管理（后台）
├── hooks/               # 自定义 Hooks
│   └── usePost.ts       # 文章存储 hook
├── layouts/             # 布局组件
│   ├── AdminLayout.tsx  # 管理后台布局（带侧边栏）
│   └── AppLayout.tsx    # 应用主布局（头部+页脚）
├── pages/               # 页面组件
│   ├── AdminDashboardPage.tsx    # 后台管理仪表板
│   ├── ArticleDetailPage.tsx     # 文章详情页（含右侧评论区）
│   ├── ReplyDetailPage.tsx       # 回复详情页
│   ├── CreateArticlePage.tsx     # 创建文章页
│   ├── EditArticlePage.tsx       # 编辑文章页
│   └── HomePage.tsx              # 首页
├── store/               # 状态管理
│   ├── postStore.ts     # 文章状态（Zustand）
│   ├── commentStore.ts  # 评论状态（Zustand）
│   └── themeStore.ts    # 主题状态（Zustand）
├── types/               # TypeScript 类型定义
│   └── index.ts         # 公共类型（Post、Comment、ApiResponse 等）
├── styles/              # 全局样式
│   └── global.css       # Tailwind CSS 导入和全局样式
├── lib/                 # 工具函数
│   └── utils.ts         # 公用工具函数
├── assets/              # 静态资源
│   ├── mockPosts.ts     # 模拟数据
│   └── mockComments.ts  # 模拟评论数据
├── App.tsx              # 根组件和路由配置
└── main.tsx             # 应用入口
```

## 📁 目录约定

### 公共层
- `src/components/` 只放跨业务复用的通用组件。
- `src/lib/` 只放纯工具函数，不放业务逻辑。
- `src/styles/` 只放全局样式和基础样式入口。

### 业务层
- `src/features/` 按业务域组织复用组件。
- `src/pages/` 只放路由级页面。
- `src/store/` 按业务域拆分状态管理。
- `src/types/` 按业务域拆分类型定义，`src/types/index.ts` 仅做过渡聚合。
- `src/assets/` 只放静态资源和 mock 数据。

### 编排层
- `src/App.tsx` 只负责路由和全局布局编排。
- `src/main.tsx` 只负责应用挂载。
- `src/layouts/` 只负责页面壳子和区域布局。
- `src/hooks/` 只放跨页面复用的组合逻辑。

### 新增文件规则
- 新增文章、评论、认证、账号相关内容，优先放进对应 `features/`、`store/`、`types/` 子目录。
- 除非确实是跨业务复用，否则不要继续往 `src/components/` 堆文件。
- `src/types/index.ts` 以后不再扩充新类型，只保留兼容导出。

## 🎯 页面功能详解

| 页面 | 路由 | 描述 |
|------|------|------|
| **首页** | `/` | 展示所有文章列表，支持分页和加载状态 |
| **全部文章** | `/articles` | 从导航栏进入，按文章标签分类展示全部文章卡片 |
| **文章详情** | `/article/:id` | 显示完整文章内容、作者、日期和标签，右侧展示评论区 |
| **回复详情** | `/article/:postId/comment/:commentId/replies` | 显示某条评论的所有回复，支持继续回复 |
| **后台仪表板** | `/admin` | 管理员统计面板，显示文章数、更新时间、标签统计 |
| **创建文章** | `/admin/create` | 表单编辑器，支持标题、作者、摘要、内容和标签输入 |
| **编辑文章** | `/admin/edit/:id` | 修改现有文章内容 |

## 🚧 当前阶段重点

### Week 1-4 MVP
- P0: 认证链路、JWT 对接、文章模型/API、API v1 稳定。
- P1: axios 拦截器、Protected Route、真实登录/注册、文章列表和详情联调。
- P2: ShadcnUI 表单与基础组件、TinyMCE、reCAPTCHA、评论真实 API。
- P3: Docker、Nginx、基础 CI/CD。

### 分支规则
- 新任务优先从 `develop` 或当前集成分支切出。
- 分支命名建议：`feat/FE-xxx-*`、`feat/BE-xxx-*`、`fix/FE-xxx-*`、`fix/BE-xxx-*`、`chore/CI-xxx-*`。
- 每个分支尽量对应一个 Issue 和明确验收标准。

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **React 19** | UI 框架 |
| **TypeScript** | 类型安全 |
| **React Router v7** | 路由管理 |
| **Zustand** | 轻量级全局状态管理 |
| **Tailwind CSS** | 原子化样式系统 |
| **PostCSS** | CSS 处理 |
| **Vite** | 快速构建工具 |
| **ShadcnUI** | 组件体系（逐步接入） |
| **Radix UI Icons** | 图标库 |
| **Bun** | 包管理器和运行时 |

## 🚀 快速开始

### 前置要求
- Node.js 或 Bun 运行时

### 安装依赖
```bash
bun install
```

### 开发服务器
```bash
bun run dev
```
自动在浏览器打开 `http://localhost:5173`

### 构建生产版本
```bash
bun run build
```

> 说明：当前仓库未配置独立 lint 脚本，`bun run build` 是最低校验门槛。涉及登录、路由、表单和评论交互时，构建通过后还需要手工走一遍关键路径。

### 预览构建结果
```bash
bun run preview
```

## 📦 状态管理

### postStore - 文章管理
```typescript
// 状态
posts[]          // 所有文章列表
currentPost      // 当前查看的文章
isLoading        // 加载中状态
error            // 错误信息

// 方法
fetchPosts()                    // 获取所有文章
fetchPostById(id)               // 获取单个文章
addPost(post)                   // 新增文章
updatePost(id, updates)         // 更新文章
deletePost(id)                  // 删除文章
clearError()                    // 清空错误信息
```

### commentStore - 评论管理
```typescript
// 状态
comments: Map   // 按 postId 分组的评论列表
isLoading       // 加载中状态
error           // 错误信息

// 方法
fetchComments(postId)           // 获取文章评论
addComment(postId, comment)     // 新增评论
deleteComment(postId, id)       // 删除评论
updateComment(postId, id, updates) // 更新评论
likeComment(postId, id)         // 点赞评论
dislikeComment(postId, id)      // 踩评论
getCommentsByPostId(postId)     // 获取文章评论列表
getCommentReplies(commentId, postId) // 获取评论的所有回复
clearError()                    // 清空错误信息
```

### themeStore - 主题管理
```typescript
// 状态
theme: "light" | "dark"    // 当前主题

// 方法
toggleTheme()              // 切换主题（自动保存到 localStorage）
```

## 🔌 API 与联调

- 当前项目正逐步从 mock 数据迁移到真实 API。
- 认证、文章、评论等接口后续将统一走 `/api/v1/*`。
- 建议在新功能开发前先确认后端是否已提供对应接口契约。

## 🧪 协作约定

- 先看对应 Issue 的优先级和验收标准，再开始改动。
- P0 优先处理安全和阻塞链路，其次是 P1 核心功能，再处理体验和工程项。
- 变更涉及路由、状态流、依赖或全局样式时，先确认影响范围。
- 功能变化影响用户理解或使用时，README 需要同步更新。

## 🎨 主要组件

### `src/components/` 全局通用组件
### Header 组件
- 顶部导航栏，包含 Logo 和主题切换按钮
- 支持深色模式样式

### Footer 组件
- 页脚区域，展示关于、快速链接、社交媒体和版权信息

### ThemeProvider 组件
- 监听主题状态变化
- 自动更新 HTML 元素的 `dark` class

### `src/features/articles/components/` 文章域组件
### PostCard 组件
- 文章卡片展示，包含标题、摘要和标签
- 可点击跳转到文章详情页

### ArticleForm 组件
- 表单验证（标题、摘要、内容必填，至少一个标签）
- 标签动态管理（添加/删除）
- 支持深色模式样式

### `src/features/comments/components/` 评论域组件
### CommentForm 组件
- 简化的评论输入表单（仅需评论内容）
- 动态提示词（发表/回复）
- 实时字符计数
- 表单验证和错误提示

### CommentList 组件
- 嵌套评论树形结构展示
- 评论者信息和时间戳
- 回复功能按钮
- 管理员删除功能

### CommentManagement 组件
- 后台评论管理界面
- 评论统计和筛选
- 批量删除功能

### `src/features/auth/components/` 认证组件
### LoginPopover 组件
- 登录 / 注册弹窗
- 支持切换标签页与密码可见性

### `src/features/account/components/` 账号组件
### AvatarUpload 组件
- 头像预览与本地选择上传
- 支持校验文件类型和大小

### ShadcnUI 集成说明
- 当前已处于接入阶段，优先用于表单、按钮、输入框等高频交互组件。
- 组件替换遵循“先可用、后统一”的原则，不一次性重写整套 UI。

## 📱 响应式设计

使用 Tailwind CSS 实现完整的响应式布局：
- 📱 移动设备优先
- 💻 平板和桌面适配
- 📐 栅格系统自适应列数

## 🔄 数据流

```
React Router
    ↓
页面组件
    ↓
Zustand Store (postStore、themeStore)
    ↓
组件重新渲染 ← localStorage（主题持久化）
```

## 💾 本地存储

- **主题设置**：切换的主题选择会保存到 `localStorage`
- **评论数据**：评论数据存储在 `localStorage`（key: `blog_comments`）
- **模拟数据**：当前使用 `mockPosts.ts` 和 `mockComments.ts` 中的硬编码数据

## 🔌 集成后端

项目使用模拟数据，可以通过以下步骤集成真实 API：

1. 修改 `postStore.ts` 中的 `fetchPosts()` 和 `fetchPostById()` 方法
2. 调用真实的后端 API 端点
3. 相应组件和逻辑无需修改

## 📝 表单验证规则

### 文章创建/编辑
- ✅ 标题非空
- ✅ 摘要非空
- ✅ 内容非空
- ✅ 至少添加一个标签

### 评论发表
- ✅ 评论内容非空
- ✅ 评论内容至少2个字符

## 🎯 项目特点

- 🎯 **模块化设计** - 清晰的文件结构，易于维护和扩展
- 💪 **类型安全** - 完整的 TypeScript 类型定义
- 🚀 **性能优先** - 使用 Vite 快速构建，Zustand 轻量级状态管理
- 🎨 **现代化 UI** - Tailwind CSS 原子化样式
- 📱 **全端适配** - 响应式设计覆盖所有设备
- ✨ **暗黑模式** - 内置深色模式支持和持久化

## 📋 更新日志

### v1.2.0 (参考B站评论区设计 - 2026-03-24)
- ✨ **评论布局优化** - 将评论区放在文章右侧（桌面端粘性侧栏），取代浮动按钮
- ✨ **点赞和踩功能** - 支持对评论的点赞和踩，显示实时计数
- ✨ **回复管理** - 展开按钮展示回复数量，点击查看所有回复
- ✨ **回复详情页** - 新增专门页面展示某条评论的所有回复，支持继续回复
- ✨ **响应式改进** - 评论卡片样式优化，支持移动端和桌面端适配
- 🔧 **类型定义增强** - Comment 类型添加 likes、dislikes、replyCount 字段
- 🔧 **Store 功能扩展** - commentStore 新增 likeComment、dislikeComment、getCommentReplies 等方法

### v1.1.0 (评论系统)
- ✨ 简化的评论功能（仅需评论内容，无需名字和邮箱）
- ✨ **浮动评论区** - 评论框固定在屏幕右下角，跟着页面滚动
- ✨ 评论按钮（💬）- 点击展开/隐藏评论区
- ✨ 嵌套评论支持（评论的回复）
- ✨ 评论数据本地存储（localStorage）

### v1.0.0 (初始版本)
- ✅ 基础博客浏览功能
- ✅ 后台管理系统（创建、编辑、删除文章）
- ✅ 深色/浅色主题切换
- ✅ 响应式设计
- ✅ 表单验证和错误处理

## 🤝 扩展方向

- [ ] 搜索和筛选功能
- [ ] 分类管理
- [ ] SEO 优化
- [ ] 性能分析
- [ ] 用户认证
- [ ] 文章发布时间排序
- [ ] 热门文章推荐
- [ ] 评论审核与权限管理
- [ ] 评论分页和加载更多