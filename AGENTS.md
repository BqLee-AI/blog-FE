# AGENTS.md - AI Agent 工作指南

## 1. 项目概览

- 项目类型：React 19 + TypeScript 的个人博客前端应用。
- 技术栈：Vite、React Router v7、Zustand、Tailwind CSS、Bun。
- 项目目标：提供博客浏览、文章管理、评论交互和后台管理的前端实现。

### 核心约束

- 禁止使用 `any` 类型，类型必须尽量精确。
- 禁止使用类组件，统一使用函数式组件和 Hooks。
- 不修改 `src/assets/mockPosts.ts` 的数据结构。
- 全局状态优先通过 Zustand store 管理，不在组件外部散落业务状态。
- 不修改依赖版本、`.env` 文件和构建配置，除非用户明确要求。

## 2. 工作原则

- 先读再写：修改前先查看相关页面、组件、store、hook、类型和 README。
- 优先复用：先搜索现有实现，尽量复用已有 hooks、store 方法、工具函数和组件。
- 变更最小：只改完成任务所需的文件和逻辑，不顺手重构无关代码。
- 风险前置：涉及路由、状态流、配置、依赖时，先确认影响范围，再动手。
- 文档同步：功能变化会影响用户使用方式时，优先更新 README 再落代码。

## 3. 开发命令

### 安装依赖

```bash
bun install
```

### 本地开发

```bash
bun run dev
```

### 构建与预览

```bash
bun run build
bun run preview
```

### 说明

- 当前仓库未配置独立的 lint 脚本，默认以 `bun run build` 作为基础校验。
- `bun run build` 会先执行 TypeScript 检查，再进行 Vite 构建。

## 4. 代码规范

### TypeScript

- 优先使用 `interface` 定义对象和 props。
- `type` 用于联合类型、别名和更复杂的类型组合。
- 需要映射关系时再使用 `enum`，不要为了形式感滥用。
- 避免硬编码魔法值，必要时提取为常量。

### React

- 组件保持纯粹，业务逻辑尽量下沉到 hook 或 store。
- 事件处理函数命名统一使用 `handle` 前缀。
- 异步请求和状态写入优先放进 store，不在组件里手写重复请求流程。

### 命名

- 组件名、类型名、布局名使用 PascalCase。
- 函数、变量、hook 返回值使用 camelCase。
- 常量使用 UPPER_CASE_SNAKE_CASE。

## 5. 复用与分层

### 优先检查的顺序

1. `src/hooks/`：先看是否已有可直接复用的组合逻辑。
2. `src/store/`：先看是否已有现成状态方法可以直接调用。
3. `src/lib/utils.ts`：先看是否已有通用工具函数。
4. `src/components/` 和 `src/features/`：先看是否已有可扩展的公共组件。

### 重复代码处理方式

- 逻辑重复：提取到 `src/hooks/`。
- 工具重复：提取到 `src/lib/utils.ts`。
- 状态操作重复：优先补充 store 方法，而不是在组件中复制请求逻辑。
- UI 模式重复：抽成复用组件，优先放到 `src/components/` 或对应 `src/features/` 域下。

### 目录约定

- `src/pages/` 只放路由级页面。
- `src/layouts/` 只放页面壳和区域布局。
- `src/features/` 按业务域组织可复用组件。
- `src/components/` 只放跨业务复用的通用组件。
- `src/store/` 放 Zustand 状态管理。
- `src/types/` 放类型定义，`src/types/index.ts` 只做聚合导出。
- `src/assets/` 只放静态资源和 mock 数据。

## 6. 变更边界

### 可以直接做

- 新增页面、组件、hook 和工具函数。
- 调整页面样式和交互。
- 修复 bug、补充错误处理、优化性能。
- 根据功能变化更新 README。

### 先确认再做

- 修改已有路由路径。
- 新增第三方依赖。
- 改动 store 核心流程。
- 改动 TypeScript 或 Vite 配置。
- 调整全局状态组织方式。

### 不要做

- 修改或删除 `src/assets/mockPosts.ts` 的结构。
- 使用 `any`、`var`、全局变量或 `window` 存业务状态。
- 提交 `node_modules`、`dist`、IDE 配置等无关产物。
- 重复造轮子：已有函数、hook、store 方法或组件能复用时不要再新建同义实现。

## 7. 验证方式

- 常规修改后优先跑 `bun run build`。
- 如果改动涉及复杂交互或数据流，补充对应测试；当前仓库未提供完整测试脚手架时，以构建通过作为最低门槛。
- 修改前后都要保持 TypeScript 严格约束不被破坏。

## 8. README 规则

- 新增页面或路由时，更新页面功能说明。
- 新增核心能力时，更新功能概览或项目结构。
- 新增组件、hook 或 store 时，补充目录说明。
- 影响用户理解或使用方式的改动，默认需要同步 README。

## 9. 调试提示

- 文章列表异常时，先看 `postStore` 和 mock 数据结构。
- 主题异常时，先看 `themeStore` 和 `ThemeProvider`。
- 路由异常时，先看 `App.tsx` 和对应页面文件。

*最后更新：2026-03-28*
