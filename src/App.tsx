import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import { useThemeInit } from "./hooks/useThemeInit";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ReplyDetailPage from "./pages/ReplyDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";

function AppContent() {
  // 初始化主题
  useThemeInit();

  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/article/:postId/comment/:commentId/replies" element={<ReplyDetailPage />} />
        </Route>

        {/* 后台管理路由 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/create" element={<CreateArticlePage />} />
          <Route path="/admin/edit/:id" element={<EditArticlePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

