import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminSidebar } from "./components/AdminSidebar";
import { LoginPage } from "./components/LoginPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { signOut } from "./API/authAPI";
import { routes } from "./routes";

export default function App() {
  const getAuthToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        localStorage.removeItem("refreshToken");
      }
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  if (isAppLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
      </main>
    </div>
  );
}
