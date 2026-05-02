# AGENTS.md - blog-FE Agent 工作指南

## 1. 角色与目标

- 目标是让 Agent 在 blog-FE 内按 blog-Docs 的控制面要求稳定交付前端改动。
- 先边界，后实现；先验证，后合并；先回写，后遗忘。
- blog-Docs 负责规则、流程、模板和闭环机制；blog-FE 负责实现、验证和回写。

## 2. 必读顺序

每次动手前，先按这个顺序检查控制面文档：

1. `blog-Docs/docs/01-control-plane/`：冻结范围、契约边界、治理原则。
2. `blog-Docs/docs/02-workflow/`：Spec -> Issue -> Test、PR 合并门禁、进度同步和发版规则。
3. `blog-Docs/docs/03-harness/`：验证闭环、最小 smoke、证据格式。
4. `blog-Docs/docs/04-standards/`：AGENTS 编写标准和 FE/BE 采用门禁。

## 3. 项目约束

- 项目类型：React 19 + TypeScript 的个人博客前端。
- 技术栈：Vite、React Router v7、Zustand、Tailwind CSS、Bun。
- 不使用 `any`，类型尽量精确。
- 不使用类组件，统一使用函数组件和 Hooks。
- 不修改 `src/assets/mockPosts.ts` 的数据结构。
- 全局状态优先通过 Zustand store 管理，不在组件外部散落业务状态。
- 不修改依赖版本、`.env` 文件和构建配置，除非用户明确要求。
- 变更如果触及 scope、contract、change boundary 或验证口径，先回到 blog-Docs 的控制面文档对齐，再继续实现。

## 4. 工作原则

- 先读再写：修改前先查看相关页面、组件、store、hook、类型和 README。
- 优先复用：先搜索现有实现，尽量复用已有 hooks、store 方法、工具函数和组件。
- 变更最小：只改完成任务所需的文件和逻辑，不顺手重构无关代码。
- 风险前置：涉及路由、状态流、契约、配置、依赖时，先确认影响范围，再动手。
- 文档同步：功能变化会影响用户使用方式时，优先更新 README；涉及控制面状态时，同步进度记录。

## 5. 优先检查的代码层

1. `src/hooks/`：先看是否已有可直接复用的组合逻辑。
2. `src/store/`：先看是否已有现成状态方法可以直接调用。
3. `src/lib/utils.ts`：先看是否已有通用工具函数。
4. `src/components/` 和 `src/features/`：先看是否已有可扩展的公共组件。

重复代码的处理方式：

- 逻辑重复，提取到 `src/hooks/`。
- 工具重复，提取到 `src/lib/utils.ts`。
- 状态操作重复，优先补充 store 方法，而不是在组件里复制请求逻辑。
- UI 模式重复，抽成复用组件，优先放到 `src/components/` 或对应 `src/features/` 域下。

## 6. 目录约定

- `src/pages/` 只放路由级页面。
- `src/layouts/` 只放页面壳和区域布局。
- `src/features/` 按业务域组织可复用组件。
- `src/components/` 只放跨业务复用的通用组件。
- `src/store/` 放 Zustand 状态管理。
- `src/types/` 放类型定义，`src/types/index.ts` 只做聚合导出。
- `src/assets/` 只放静态资源和 mock 数据。

## 7. 开发命令

```bash
bun install
bun run dev
bun run build
bun run preview
```

- 当前仓库未配置独立 lint 脚本，默认以 `bun run build` 作为基础校验。
- `bun run build` 会先执行 TypeScript 检查，再进行 Vite 构建。

## 8. 代码规范

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

## 9. 变更边界

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
- 任何可能影响控制面边界、契约语义或验证口径的改动。

### 不要做

- 修改或删除 `src/assets/mockPosts.ts` 的结构。
- 使用 `any`、`var`、全局变量或 `window` 存业务状态。
- 提交 `node_modules`、`dist`、IDE 配置等无关产物。
- 重复造轮子：已有函数、hook、store 方法或组件能复用时不要再新建同义实现。

## 10. 受理、PR 与验证

- Issue 进入开发前，至少要有 Spec、Contract/Rule、Harness 计划。
- PR 描述至少要包含：关联 Issue、对应 Spec、受影响的 Contract/Rule、Harness 验证结果、风险与回滚。
- 没有验证证据的 PR 不要推进合并；至少要有 Build/Typecheck，必要时补单元测试和关键链路 smoke。
- 证据写法要能复核，保留命令、结果、日志或截图/报告结论。
- 候选版冻结后只允许修发布阻塞项，不再追加新功能。

## 11. 同步与回写

- 最低每周同步一次进度；关键 PR 合并后尽量立即同步。
- 同步至少包含 FE 进度、BE 进度、跨端阻塞、新增风险、候选版本状态和下一批行动。
- 新增页面或路由时，更新页面功能说明。
- 新增核心能力时，更新功能概览或项目结构。
- 新增组件、hook 或 store 时，补充目录说明。
- 影响用户理解或使用方式的改动，默认需要同步 README。

## 12. 调试提示

- 文章列表异常时，先看 `postStore` 和 mock 数据结构。
- 主题异常时，先看 `themeStore` 和 `ThemeProvider`。
- 路由异常时，先看 `App.tsx` 和对应页面文件。

*最后更新：2026-05-02*
