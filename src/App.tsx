import React, { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { StatsOverview } from "./components/StatsOverview";
import { UserAnalytics } from "./components/UserAnalytics";
import { DiagnosisResults } from "./components/DiagnosisResults";
import { UserManagement } from "./components/UserManagement";
import { Settings } from "./components/Settings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <UserManagement />
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
    <div className="flex h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}