import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import AccountPage from "./pages/AccountPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
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

