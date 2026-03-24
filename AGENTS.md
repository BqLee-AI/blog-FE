# AGENTS.md - AI Agent 工作指南

## 1. Project Overview（项目基础信息）

- **项目类型**：React 19 + TypeScript 个人博客前端应用
- **核心技术栈**：Vite 5.0 + React 19 + TypeScript 5.2 + Tailwind CSS 3.4 + Zustand + React Router v7 + Bun
- **项目用途**：提供博客浏览和后台管理的完整前端解决方案
- **核心约束**：
  - 禁止使用 `any` 类型，所有类型必须精确定义
  - 遵循 React 函数式组件规范，禁止使用类组件
  - 不修改 `src/assets/mockPosts.ts` 的模拟数据结构
  - 所有状态管理通过 Zustand store（`postStore`、`themeStore`）
  - 新增功能需更新 README.md

---

## 2. Setup & Development（环境搭建与开发流程）

### 2.1 依赖安装
```bash
bun install  # 安装所有依赖
```

### 2.2 开发运行
```bash
bun run dev      # 启动开发服务器（自动打开 http://localhost:5173）
bun run build    # 生产构建输出到 dist/
bun run preview  # 预览构建产物
```

### 2.3 代码格式化与检查
```bash
bun run lint     # 执行 ESLint 检查（如果已配置）
```

---

## 3. Testing Guidelines（测试规范）

### 3.1 测试框架与命令
- **测试框架**：Vitest（如需配置）
- 新增代码测试覆盖率要求：≥80%
- **测试文件命名**：`xxx.test.ts` 或 `xxx.test.tsx`，与业务文件同目录

### 3.2 测试要求
- 单元测试覆盖所有 hooks、store、工具函数
- 组件测试覆盖核心交互逻辑
- 禁止跳过必填测试用例
- 禁止修改预期结果以通过测试

---

## 4. Code Style（代码风格规范）

### 4.1 通用规则
- **格式化工具**：Prettier（如已配置）
- **提交前必须**：确保代码无拼写错误、变量命名规范、逻辑清晰
- **禁止使用**：
  - `any` 类型（使用 `unknown` 或具体类型）
  - `var` 声明（使用 `const` 或 `let`）
  - 硬编码魔法值（如直接写 `300` 代替定义常量）

### 4.2 React + TypeScript 专属规则

#### 组件风格
```tsx
// ✅ 正确：函数式组件 + 类型定义
interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const handleDelete = () => {
    onDelete?.(post.id);
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      {onDelete && <button onClick={handleDelete}>删除</button>}
    </div>
  );
};

// ❌ 错误：类组件、any 类型
class PostCard extends React.Component<any> {
  render() {
    return <div>{this.props.title}</div>;
  }
}
```

#### 命名规范
- **组件名**：PascalCase（如 `PostCard`、`AdminLayout`）
- **函数名**：camelCase（如 `handleDelete`、`fetchPosts`）
- **常量名**：UPPER_CASE_SNAKE_CASE（如 `MAX_PAGE_SIZE`）
- **类型名**：PascalCase（如 `Post`、`ApiResponse`）

#### Hooks 编写规范
```tsx
// ✅ 正确：自定义 hook 返回类型明确
interface UsePostReturn {
  post: Post | null;
  isLoading: boolean;
  error: string | null;
  fetch: (id: number) => Promise<void>;
}

export const usePostDetail = (id: number): UsePostReturn => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (postId: number) => {
    setLoading(true);
    try {
      const data = await store.fetchPostById(postId);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return { post, isLoading, error, fetch };
};
```

#### 状态管理规范
- **使用 Zustand store** 管理全局状态（不直接在组件中定义）
- **store 方法命名**：动词开头（如 `fetchPosts`、`addPost`、`toggleTheme`）
- **异步操作**：在 store 中 handle，返回 Promise，让组件端防止深层耦合

### 4.3 代码复用与避免重复（DRY 原则）

#### 优先使用已有实现
在编写新代码前，**必须先搜索现有代码库**，确认是否已有相同或相似的实现。遵循优先级：

1. **检查现有 hooks**（`src/hooks/*.ts`）
   - 如需获取文章数据，先检查是否有 `usePost`、`usePostDetail`
   - 如需主题操作，先查看 `useThemeInit`

2. **检查 store 方法**（`src/store/*.ts`）
   - 如需文章操作，先使用 `postStore.fetchPosts()`、`postStore.addPost()` 等已有方法
   - 不得重新定义相同功能的 API 调用逻辑

3. **检查工具函数**（`src/lib/utils.ts`）
   - 数值转换、字符串处理等常用功能，优先复用已有工具函数
   - 新工具函数添加到此文件，而非在各组件中重复定义

4. **检查公共组件**（`src/components/`）
   - UI 模式、表单元素等，优先使用或扩展已有组件
   - 避免创建功能重复的组件

#### 代码复用检查清单
```tsx
// ❌ 错误：重复创建全局变量和帮助函数
// src/pages/HomePage.tsx
const formatDate = (date: string) => new Date(date).toLocaleDateString();
const API_DELAY = 300; // 已在 store 中定义过
const fetchArticles = async () => { /* 实现 */ }; // 使用 postStore.fetchPosts()

// ✅ 正确：优先使用已有实现
// src/pages/HomePage.tsx
import { usePost } from '@/hooks/usePost';
import { formatDate } from '@/lib/utils'; // 如果已定义
import { postStore } from '@/store/postStore';

export const HomePage = () => {
  const { posts, fetchPosts } = usePost();
  
  useEffect(() => {
    fetchPosts(); // 直接使用 store 方法
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          {post.title}
          <span>{formatDate(post.createdAt!)}</span>
        </div>
      ))}
    </div>
  );
};
```

#### 发现重复代码时的处理
- **小范围重复** → 提取为工具函数放到 `src/lib/utils.ts`
- **组件逻辑重复** → 提取为自定义 hook 放到 `src/hooks/`
- **状态操作重复** → 检查是否应加入 store 方法
- **UI 模式重复** → 创建可复用组件，放到 `src/components/`

---

## 5. Directory Structure & Core Files（目录结构与核心文件）

```
src/
├── components/      # 可复用组件（遵循单一职责原则）
├── hooks/          # 自定义 hooks（逻辑复用）
├── layouts/        # 布局组件（AppLayout、AdminLayout）
├── pages/          # 页面组件（与路由一一对应）
├── store/          # Zustand store（postStore、themeStore）
├── types/          # TypeScript 类型定义（Post、ApiResponse 等）
├── styles/         # 全局样式（global.css）
├── lib/            # 工具函数
├── assets/         # 静态资源和模拟数据
├── App.tsx         # 路由配置和应用入口
└── main.tsx        # DOM 挂载点
```

**核心文件**（修改时需特别谨慎）：
- `App.tsx`：路由配置，修改前需理解现有路由层级
- `store/*.ts`：全局状态，修改需评估影响范围
- `types/index.ts`：类型定义，修改需向下兼容

---

## 6. Operating Boundaries & Prohibitions（操作边界与禁止行为）

### 6.1 ✅ 允许的操作
- 新增页面、组件、自定义 hooks
- 修改组件样式、UI 交互逻辑
- 优化性能（如 memo、useMemo）
- 修复 bug、完善错误处理
- 更新 README.md 和文档

### 6.2 ⚠️ 需先询问用户的操作
- 修改已有路由路径（影响用户书签和外部链接）
- 添加新的 npm 依赖（需评估包大小和安全性）
- 修改 store 核心逻辑（影响状态流）
- 修改 TypeScript 配置（影响类型检查规则）
- 修改 Vite 配置（影响构建行为）

### 6.3 🚫 绝对禁止的操作
- 修改或删除 `src/assets/mockPosts.ts` 的数据结构
- 修改 `.env`、`.env.local` 密钥文件
- 删除或重构 `src/core`、`src/types` 等核心目录
- 使用 `any` 类型
- 提交 `node_modules/`、IDE 配置（`.vscode/`）、编译产物（`dist/`）
- 修改 `package.json` 中的依赖版本
- 使用全局变量或 window 对象存储业务状态（必须用 store）
- **重复创建已有的函数、hook、store 方法或组件**（违反 DRY 原则）
  - 新增功能前必须搜索现有代码，优先复用而非重新实现
  - 如发现重复，立即重构提取为可复用的函数/hook/组件

---

## 7. Common Issues & Debugging（常见问题与排错）

### 7.1 常见问题速查
| 问题 | 排查方法 |
|------|---------|
| 开发服务启动失败 | 检查 5173 端口是否被占用：`netstat -ano \| findstr :5173` |
| 类型错误 "property does not exist" | 检查类型定义是否完整，运行 `bun run build` 编译检查 |
| 主题未保存 | 检查浏览器 localStorage 是否禁用，`themeStore` 的 `toggleTheme()` 是否被调用 |
| 文章列表为空 | 确认 `mockPosts.ts` 中存在数据，`fetchPosts()` 是否返回正确数据结构 |

### 7.2 调试技巧
- 使用 React DevTools 检查组件状态和 props
- 使用 localStorage 检查主题和其他数据持久化情况
- 在浏览器控制台验证 `window.__store__`（如已导出）

---

## 8. README Update Workflow（README 更新工作流）

**原则**：新功能优先加入 README，再实现代码

- 新增**页面或路由** → 更新"页面功能表"
- 新增**主要功能** → 更新"核心功能"或"特点"
- 新增**组件或 hook** → 更新"项目结构"
- **每次代码更新前** → 向用户提问是否需要更新 README
- **新功能默认策略** → 先加入 README，再实现代码

---

## 9. TypeScript Best Practices（TypeScript 最佳实践）

### 9.1 类型定义优先级
1. **interface**：用于定义对象结构、组件 props（优先选择）
2. **type**：联合类型、元组、条件类型、简单别名
3. **enum**：仅在需要值的映射时使用（如主题: `enum Theme { Light = "light", Dark = "dark" }`）

```tsx
// ✅ 推荐
interface Post {
  id: number;
  title: string;
  tags: string[];
}

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// ❌ 不推荐
type Post = {
  id: number;
  title: string;
  tags: string[];
};
```

### 9.2 泛型使用规范
```tsx
// ✅ 正确：清晰的泛型约束
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// ✅ 正确：泛型约束
function fetchData<T extends { id: number }>(item: T): Promise<T> {
  return Promise.resolve(item);
}

// ❌ 错误：过度泛型化
function process<T>(data: T): T {
  return data;
}
```

---

## 10. Performance & Optimization（性能优化）

- **组件 memo**：仅为频繁重和的大组件添加 `React.memo`
- **useCallback**：在传递给子组件的回调需要引用稳定时使用
- **useMemo**：计算密集或依赖列表复杂时使用
- **代码分割**：使用 `React.lazy` + `Suspense` 分割大型页面
- **避免过度优化**：先测量性能瓶颈再优化

---

*最后更新：2026-03-24*
