import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import { initializeAuth } from "./store/authStore";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ReplyDetailPage from "./pages/ReplyDetailPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";

export default function App() {
  // 初始化认证状态
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/article/:postId/comment/:commentId/replies" element={<ReplyDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          {/* 后台管理路由 */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/create" element={<CreateArticlePage />} />
            <Route path="/admin/edit/:id" element={<EditArticlePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

