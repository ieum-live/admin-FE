import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/AdminSidebar";
import { LoginPage } from "./components/LoginPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { signOut } from "./API/authAPI";
import { routes } from "./routes";

export default function App() {
  const getAuthToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [isAppLoading, setIsAppLoading] = useState(true);
  const navigate = useNavigate();

  // 로딩 스피너 1초
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 토큰 체크
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      setIsAuthenticated(false);
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isAppLoading) return <LoadingSpinner />;

  // 레이아웃 컴포넌트
  const AdminLayout = () => (
    <div className="flex h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet /> {/* 여기서 하위 route가 렌더링됨 */}
      </main>
    </div>
  );

  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
      />

      {/* 인증 필요 레이아웃 */}
      {isAuthenticated && (
        <Route path="/" element={<AdminLayout />}>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path === "/" ? "" : route.path} element={route.element} />
          ))}

          {/* 루트 접근시 /dashboard로 리다이렉트 예시 */}
          <Route index element={<Navigate to="/dashboard" />} />

          {/* 존재하지 않는 경로 처리 */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}

      {/* 인증 안 됐으면 강제로 로그인 페이지 */}
      {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
    </Routes>
  );
}
