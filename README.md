# 📚 Blog-FE - 现代化个人博客前端

一个基于 **React 19 + TypeScript** 构建的现代化个人博客平台。提供博客浏览和后台管理两大核心功能，支持深色模式、响应式设计和完整的文章 CRUD 操作。

## ✨ 核心功能

### 🌐 博客浏览模块
- 📖 **首页展示** - 分页显示所有文章卡片
- 📄 **文章详情** - 完整展示文章内容、作者、发布日期和标签
- 🎨 **主题切换** - 支持深色/浅色主题，实时切换且自动保存到本地

### 📝 博客管理模块
- ➕ **创建文章** - 完整的表单界面，支持标题、作者、摘要、内容、标签
- ✏️ **编辑文章** - 修改现有文章内容
- 🗑️ **删除文章** - 管理后台一键删除
- 📊 **仪表板** - 实时显示文章总数、最后更新时间、标签统计

## 🏗️ 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ArticleForm.tsx  # 文章表单（新建/编辑）
│   ├── Footer.tsx       # 页脚组件
│   ├── Header.tsx       # 头部导航栏
│   ├── PostCard.tsx     # 文章卡片
│   └── ThemeProvider.tsx # 主题提供器
├── hooks/               # 自定义 Hooks
│   └── usePost.ts       # 文章存储 hook
├── layouts/             # 布局组件
│   ├── AdminLayout.tsx  # 管理后台布局（带侧边栏）
│   └── AppLayout.tsx    # 应用主布局（头部+页脚）
├── pages/               # 页面组件
│   ├── AdminDashboardPage.tsx    # 后台管理仪表板
│   ├── ArticleDetailPage.tsx     # 文章详情页
│   ├── CreateArticlePage.tsx     # 创建文章页
│   ├── EditArticlePage.tsx       # 编辑文章页
│   └── HomePage.tsx              # 首页
├── store/               # 状态管理
│   ├── postStore.ts     # 文章状态（Zustand）
│   └── themeStore.ts    # 主题状态（Zustand）
├── types/               # TypeScript 类型定义
│   └── index.ts         # 公共类型（Post、ApiResponse 等）
├── styles/              # 全局样式
│   └── global.css       # Tailwind CSS 导入和全局样式
├── lib/                 # 工具函数
│   └── utils.ts         # 公用工具函数
├── assets/              # 静态资源
│   └── mockPosts.ts     # 模拟数据
├── App.tsx              # 根组件和路由配置
└── main.tsx             # 应用入口
```

## 🎯 页面功能详解

| 页面 | 路由 | 描述 |
|------|------|------|
| **首页** | `/` | 展示所有文章列表，支持分页和加载状态 |
| **文章详情** | `/article/:id` | 显示完整文章内容、作者、日期和标签 |
| **后台仪表板** | `/admin` | 管理员统计面板，显示文章数、更新时间、标签统计 |
| **创建文章** | `/admin/create` | 表单编辑器，支持标题、作者、摘要、内容和标签输入 |
| **编辑文章** | `/admin/edit/:id` | 修改现有文章内容 |

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

### themeStore - 主题管理
```typescript
// 状态
theme: "light" | "dark"    // 当前主题

// 方法
toggleTheme()              // 切换主题（自动保存到 localStorage）
```

## 🎨 主要组件

### Header 组件
- 顶部导航栏，包含 Logo 和主题切换按钮
- 支持深色模式样式

### Footer 组件
- 页脚区域，展示关于、快速链接、社交媒体和版权信息

### PostCard 组件
- 文章卡片展示，包含标题、摘要和标签
- 可点击跳转到文章详情页

### ArticleForm 组件
- 表单验证（标题、摘要、内容必填，至少一个标签）
- 标签动态管理（添加/删除）
- 支持深色模式样式

### ThemeProvider 组件
- 监听主题状态变化
- 自动更新 HTML 元素的 `dark` class

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
- **模拟数据**：当前使用 `mockPosts.ts` 中的硬编码数据

## 🔌 集成后端

项目使用模拟数据，可以通过以下步骤集成真实 API：

1. 修改 `postStore.ts` 中的 `fetchPosts()` 和 `fetchPostById()` 方法
2. 调用真实的后端 API 端点
3. 相应组件和逻辑无需修改

## 📝 表单验证规则

创建/编辑文章时需要满足：
- ✅ 标题非空
- ✅ 摘要非空
- ✅ 内容非空
- ✅ 至少添加一个标签

## 🎯 项目特点

- 🎯 **模块化设计** - 清晰的文件结构，易于维护和扩展
- 💪 **类型安全** - 完整的 TypeScript 类型定义
- 🚀 **性能优先** - 使用 Vite 快速构建，Zustand 轻量级状态管理
- 🎨 **现代化 UI** - Tailwind CSS 原子化样式
- 📱 **全端适配** - 响应式设计覆盖所有设备
- ✨ **暗黑模式** - 内置深色模式支持和持久化

## 📋 更新日志

### v1.0.0 (初始版本)
- ✅ 基础博客浏览功能
- ✅ 后台管理系统（创建、编辑、删除文章）
- ✅ 深色/浅色主题切换
- ✅ 响应式设计
- ✅ 表单验证和错误处理

## 🤝 扩展方向

- [ ] 搜索和筛选功能
- [ ] 评论系统
- [ ] 分类管理
- [ ] SEO 优化
- [ ] 性能分析
- [ ] 用户认证
- [ ] 文章发布时间排序
- [ ] 热门文章推荐