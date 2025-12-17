import { StatsOverview } from "./components/StatsOverview";
import { UserAnalytics } from "./components/UserAnalytics";
import { DiagnosisResults } from "./components/DiagnosisResults";
import { UserManagement } from "./components/UserManagement";
import { UsageAnalytics } from "./components/UsageAnalytics";
import { Settings } from "./components/Settings";
import React from "react";

export const routes = [
  {
    path: "/",
    exact: true,
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">전체 대시보드</h1>
          <p className="text-muted-foreground">이음 어드민 페이지</p>
        </div>
        <StatsOverview />
        <UserAnalytics />
      </div>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">전체 대시보드</h1>
          <p className="text-muted-foreground">이음 어드민 페이지</p>
        </div>
        <StatsOverview />
        <UserAnalytics />
      </div>
    ),
  },
  {
    path: "/usage-analytics",
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">사용량 분석</h1>
          <p className="text-muted-foreground">
            재방문율, 사용시간, 기능별 분석
          </p>
        </div>
        <UsageAnalytics />
      </div>
    ),
  },
  {
    path: "/diagnosis-results",
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">진단 결과 및 추이</h1>
          <p className="text-muted-foreground">
            자가진단 결과 분석 및 개선율 추적
          </p>
        </div>
        <DiagnosisResults />
      </div>
    ),
  },
  {
    path: "/user-management",
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">사용자 관리</h1>
          <p className="text-muted-foreground">
            사용자 정보 관리, 상태 모니터링 및 알림 발송
          </p>
        </div>
        <UserManagement />
      </div>
    ),
  },
  {
    path: "/settings",
    element: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">설정</h1>
          <p className="text-muted-foreground">시스템 설정 및 환경 구성</p>
        </div>
        <Settings />
      </div>
    ),
  },
];
