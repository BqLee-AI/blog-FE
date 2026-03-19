export type Post = {
  id: number;
  title: string;
  summary: string;
  tags: string[];
};

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Build React without Templates",
    summary: "Set up your project by hand to understand each moving part.",
    tags: ["react", "setup", "vite"]
  },
  {
    id: 2,
    title: "Organize Frontend Folders",
    summary: "A small structure goes a long way as your project grows.",
    tags: ["architecture", "frontend"]
  },
  {
    id: 3,
    title: "Write Reusable Components",
    summary: "Split UI into focused components and keep them easy to test.",
    tags: ["components", "typescript"]
  }
];
