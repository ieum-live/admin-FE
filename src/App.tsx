import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { StatsOverview } from "./components/StatsOverview";
import { UserAnalytics } from "./components/UserAnalytics";
import { DiagnosisResults } from "./components/DiagnosisResults";
import { UserManagement } from "./components/UserManagement";
import { Settings } from "./components/Settings";
import { LoginPage } from "./components/LoginPage";
import LoadingSpinner from "./components/LoadingSpinner"; // Import LoadingSpinner
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { signOut } from "./API/authAPI";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const getAuthToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isComponentLoading, setComponentLoading] = useState(false);

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

  if (isAppLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">
                전체 대시보드
              </h1>
              <p className="text-muted-foreground">
                우웅 어드민 페이지
              </p>
            </div>
            <StatsOverview />
            <UserAnalytics showUsageChart={false} />
          </div>
        );

      case "usage-analytics":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">
                사용량 분석
              </h1>
              <p className="text-muted-foreground">
                재방문율, 사용시간, 기능별 분석
              </p>
            </div>
            <UserAnalytics showUsageChart={true} />
          </div>
        );

      case "diagnosis-results":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">
                진단 결과 및 추이
              </h1>
              <p className="text-muted-foreground">
                자가진단 결과 분석 및 개선율 추적
              </p>
            </div>
            <DiagnosisResults />
          </div>
        );

      case "user-management":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">
                사용자 관리
              </h1>
              <p className="text-muted-foreground">
                사용자 정보 관리, 상태 모니터링 및 알림 발송
              </p>
            </div>
            <UserManagement setComponentLoading={setComponentLoading}/>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">설정</h1>
              <p className="text-muted-foreground">
                시스템 설정 및 환경 구성
              </p>
            </div>
            <Settings />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isComponentLoading && <LoadingSpinner />}
      <div className="flex h-screen bg-background">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </>
  );
}


