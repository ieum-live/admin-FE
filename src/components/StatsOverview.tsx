import { useEffect, useState } from "react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  ShieldCheck,
  ClipboardList,
  CalendarRange,
} from "lucide-react";
import { getDiagnosisSummary, getMetricsOverview } from "../API/overviewAPI";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "./ui/badge";
import { OverviewJoyride } from "./Joyride/OverviewJoyride";

/* ================= 타입 ================= */

type Metrics = {
  dau: number;
  wau: number;
  mau: number;
  yau: number;
  dauChangeRate: number;
  wauChangeRate: number;
  mauChangeRate: number;
  yauChangeRate: number;
};

type DAUStat = {
  title: string;
  value: number;
  icon: any;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
};

type SummaryStat = {
  title: string;
  value: string;
  icon: any;
};

/* ================= Badge ================= */

const getStatusBadge = (
  status: "low" | "medium" | "high",
  label: string
) => {
  const baseClasses = "text-xs";

  if (status === "low") {
    return (
      <Badge className={`${baseClasses} bg-green-100 text-green-800`}>
        {label}
      </Badge>
    );
  }

  if (status === "medium") {
    return (
      <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className={baseClasses}>
      {label}
    </Badge>
  );
};

/* ================= 기준 ================= */

const getImprovementStyle = (value: number) => {
  if (value >= 50) return { status: "low" as const };
  if (value >= 30) return { status: "medium" as const };
  return { status: "high" as const };
};

const getStableStyle = (value: number) => {
  if (value >= 70) return { status: "low" as const };
  if (value >= 40) return { status: "medium" as const };
  return { status: "high" as const };
};

/* ================= 컴포넌트 ================= */

export function StatsOverview() {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const [summary, setSummary] = useState({
    improvementRate: 0,
    stableRatio: 0,
    totalAssessments: 0,
    avgAssessmentIntervalDays: 0,
  });

  const [metrics, setMetrics] = useState<Metrics>({
    dau: 0,
    wau: 0,
    mau: 0,
    yau: 0,
    dauChangeRate: 0,
    wauChangeRate: 0,
    mauChangeRate: 0,
    yauChangeRate: 0,
  });

  /* -------- 요약 -------- */
  useEffect(() => {
    getDiagnosisSummary()
      .then((data) => {
        setSummary({
          improvementRate: data?.improvementRate ?? 0,
          stableRatio: data?.stableRatio ?? 0,
          totalAssessments: data?.totalAssessments ?? 0,
          avgAssessmentIntervalDays: data?.avgAssessmentIntervalDays ?? 0,
        });
      })
      .finally(() => setLoadingSummary(false));
  }, []);

  /* -------- DAU -------- */
  useEffect(() => {
    getMetricsOverview()
      .then((data) => {
        setMetrics({
          dau: data?.dau ?? 0,
          wau: data?.wau ?? 0,
          mau: data?.mau ?? 0,
          yau: data?.yau ?? 0,
          dauChangeRate: data?.dauChangeRate ?? 0,
          wauChangeRate: data?.wauChangeRate ?? 0,
          mauChangeRate: data?.mauChangeRate ?? 0,
          yauChangeRate: data?.yauChangeRate ?? 0,
        });
      })
      .finally(() => setLoadingMetrics(false));
  }, []);

  if (loadingSummary || loadingMetrics) {
    return (
      <div className="flex justify-center items-center min-h-[240px]">
        <LoadingSpinner />
      </div>
    );
  }

  /* ================= 카드 데이터 ================= */

  const dauStats: DAUStat[] = [
    {
      title: "일일 활성 사용자 (DAU)",
      value: metrics.dau,
      change: metrics.dauChangeRate,
      changeType: metrics.dauChangeRate >= 0 ? "increase" : "decrease",
      icon: Users,
      period: "전일 대비",
    },
    {
      title: "주간 활성 사용자 (WAU)",
      value: metrics.wau,
      change: metrics.wauChangeRate,
      changeType: metrics.wauChangeRate >= 0 ? "increase" : "decrease",
      icon: Calendar,
      period: "전주 대비",
    },
    {
      title: "월간 활성 사용자 (MAU)",
      value: metrics.mau,
      change: metrics.mauChangeRate,
      changeType: metrics.mauChangeRate >= 0 ? "increase" : "decrease",
      icon: TrendingUp,
      period: "전월 대비",
    },
    {
      title: "연간 활성 사용자 (YAU)",
      value: metrics.yau,
      change: metrics.yauChangeRate,
      changeType: metrics.yauChangeRate >= 0 ? "increase" : "decrease",
      icon: Activity,
      period: "전년 대비",
    },
  ];

  const summaryStats: SummaryStat[] = [
    {
      title: "전체 개선율",
      value: `${summary.improvementRate.toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      title: "안정군 비율",
      value: `${summary.stableRatio.toFixed(1)}%`,
      icon: ShieldCheck,
    },
    {
      title: "총 진단 횟수",
      value: summary.totalAssessments.toLocaleString(),
      icon: ClipboardList,
    },
    {
      title: "평균 진단 간격",
      value: `${summary.avgAssessmentIntervalDays.toFixed(1)}일`,
      icon: CalendarRange,
    },
  ];

  /* ================= UI ================= */

  return (
    <>
      <OverviewJoyride />

      {/* 🔹 DAU 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 joyride-dau-row">
        {dauStats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </div>
                <div className="joyride-dau-badge">
                {getStatusBadge(
                  stat.changeType === "increase" ? "low" : "high",
                  `${stat.change >= 0 ? "+" : ""}${stat.change.toFixed(
                    1
                  )}% · ${stat.period}`
                )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 🔹 Summary 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 joyride-summary-row">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;

          const improvement =
            stat.title === "전체 개선율"
              ? getImprovementStyle(summary.improvementRate)
              : null;

          const stable =
            stat.title === "안정군 비율"
              ? getStableStyle(summary.stableRatio)
              : null;

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent className="flex items-center gap-2">
                <div className="text-2xl font-bold ">{stat.value}</div>
                <div className="joyride-summary-badge">
                {improvement && getStatusBadge(improvement.status, "개선")}
                {stable && getStatusBadge(stable.status, "안정")}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
