import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/AdminSidebar";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { signOut } from "./API/authAPI";
import { routes } from "./routes";

export default function App() {
  const navigate = useNavigate();

  // 초기 토큰 체크
  const getAuthToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [isAppLoading, setIsAppLoading] = useState(true);

  // 로딩 스피너 1초
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 로그인 처리
  const handleLogin = () => setIsAuthenticated(true);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      setIsAuthenticated(false);
      navigate("/login"); // 로그아웃 시 강제 로그인 페이지 이동
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isAppLoading) return <LoadingSpinner />;

  // 관리자 레이아웃
  const AdminLayout = () => (
    <div className="flex h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );

  return (
    <Routes>
      {/* 랜딩 페이지 */}
      <Route
        path="/"
        element={!isAuthenticated ? <LandingPage /> : <Navigate to="/admin" />}
      />

      {/* 로그인 페이지 */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/admin" />}
      />

      {/* 인증 필요 레이아웃 */}
      {isAuthenticated ? (
        <Route path="/admin" element={<AdminLayout />}>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path === "/" ? "" : route.path.replace(/^\//, "")}
            element={route.element}
          />
        ))}

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      ) : (
        // 인증 안 됐으면 랜딩 페이지로 리다이렉트
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}
