export type Post = {
  id: number;
  title: string;
  summary: string;
  content?: string;
  tags: string[];
  createdAt?: string;
  author?: string;
};

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Build React without Templates",
    summary: "Set up your project by hand to understand each moving part.",
    content: `<p>在当今的前端开发中，React 已经成为最受欢迎的框架之一。但很多开发者都是通过 create-react-app 或者其他脚手架工具来开始项目的。这样虽然方便，但有时候我们不太清楚背后发生了什么。</p>
    
<p>本文将从零开始，手动搭建一个 React 项目，帮助你理解每一个部分的作用。</p>

<h2>为什么需要手动配置？</h2>
<p>通过手动配置项目，你可以：</p>
<ul>
<li>深入理解 Webpack/Vite 的工作原理</li>
<li>根据实际需求自定义项目结构</li>
<li>学到真正的前端工程化知识</li>
</ul>

<h2>核心步骤</h2>
<p>首先，我们需要初始化 Node.js 项目，安装必要的依赖，配置构建工具，最后创建入口点和根组件。</p>

<p>通过这个过程，你将对 React 的运行机制有更深的理解。</p>`,
    tags: ["react", "setup", "vite"],
    createdAt: "2026-03-15",
    author: "张三",
  },
  {
    id: 2,
    title: "Organize Frontend Folders",
    summary: "A small structure goes a long way as your project grows.",
    content: `<p>当你的前端项目开始增长时，良好的文件夹结构变得至关重要。一个清晰的项目结构能够：</p>

<ul>
<li>提高开发效率</li>
<li>便于团队协作</li>
<li>降低维护成本</li>
<li>使代码更容易扩展</li>
</ul>

<h2>推荐的文件夹结构</h2>
<p>这是一个经过验证的文件夹结构，适合大多数中等规模的项目：</p>

<pre><code>src/
  ├── components/    # 可复用组件
  ├── pages/        # 页面组件
  ├── layouts/      # 布局组件
  ├── store/        # 状态管理
  ├── hooks/        # 自定义 Hooks
  ├── types/        # TypeScript 类型定义
  ├── utils/        # 工具函数
  ├── styles/       # 样式文件
  └── assets/       # 静态资源
</code></pre>

<h2>关键原则</h2>
<p>按照功能而非技术类型来组织代码，这样会使得代码更加清晰易懂。</p>`,
    tags: ["architecture", "frontend"],
    createdAt: "2026-03-12",
    author: "李四",
  },
  {
    id: 3,
    title: "Write Reusable Components",
    summary: "Split UI into focused components and keep them easy to test.",
    content: `<p>编写可复用的组件是 React 开发中最重要的技能之一。好的组件应该具有以下特点：</p>

<ul>
<li><strong>单一职责</strong>：每个组件只做一件事</li>
<li><strong>高内聚</strong>：相关的逻辑应该紧密相连</li>
<li><strong>低耦合</strong>：组件之间的依赖应该尽可能少</li>
<li><strong>可测试</strong>：组件应该容易进行单元测试</li>
</ul>

<h2>最佳实践</h2>
<p>首先，使用 TypeScript 为你的 Props 添加类型检查。其次，避免在组件中放入过多的业务逻辑，使用自定义 Hooks 来提取这些逻辑。</p>

<pre><code>// ❌ 不好的做法
const ComplexComponent = () => {
  // 太多的逻辑混在一起
};

// ✅ 好的做法
interface Props {
  title: string;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ title, onClose }) => {
  // 清晰的职责
};
</code></pre>

<p>记住，简单优于复杂。当你的组件变得过于复杂时，是时候重构它了。</p>`,
    tags: ["components", "typescript"],
    createdAt: "2026-03-10",
    author: "王五",
  },
];

