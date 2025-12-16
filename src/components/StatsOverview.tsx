// 📌 StatsOverview.tsx
import { useEffect, useState } from "react";
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
import { getDiagnosisSummary } from "../API/overviewAPI";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "./ui/badge";
import React from "react";

// ---------------- 타입 선언 ----------------
type DAUStat = {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: "increase" | "decrease";
  period: string;
};

type SummaryStat = {
  title: string;
  value: string;
  icon: any;
};

type CombinedStat = DAUStat | SummaryStat;

// ---------------- Badge 스타일 ----------------
const getStatusBadge = (
  status: "low" | "medium" | "high",
  label: string
) => {
  const baseClasses = "text-xs";

  if (status === "low") {
    return (
      <Badge
        variant="default"
        className={`${baseClasses} bg-green-100 text-green-800`}
      >
        {label}
      </Badge>
    );
  }

  if (status === "medium") {
    return (
      <Badge
        variant="secondary"
        className={`${baseClasses} bg-yellow-100 text-yellow-800`}
      >
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

// ---------------- 개선율 기준 (더 엄격) ----------------
const getImprovementStyle = (value: number) => {
  if (value >= 50) {
    return {
      status: "low" as const,
      textClass: "text-green-700",
    };
  }
  if (value >= 30) {
    return {
      status: "medium" as const,
      textClass: "text-yellow-700",
    };
  }
  return {
    status: "high" as const,
    textClass: "text-red-700",
  };
};

// ---------------- 안정군 기준 ----------------
const getStableStyle = (value: number) => {
  if (value >= 70) {
    return {
      status: "low" as const,
      textClass: "text-green-700",
    };
  }
  if (value >= 40) {
    return {
      status: "medium" as const,
      textClass: "text-yellow-700",
    };
  }
  return {
    status: "high" as const,
    textClass: "text-red-700",
  };
};

export function StatsOverview() {
  const [summary, setSummary] = useState({
    improvementRate: 0,
    stableRatio: 0,
    totalAssessments: 0,
    avgAssessmentIntervalDays: 0,
  });

  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDiagnosisSummary();
        setSummary({
          improvementRate: data.improvementRate ?? 0,
          stableRatio: data.stableRatio ?? 0,
          totalAssessments: data.totalAssessments ?? 0,
          avgAssessmentIntervalDays:
            data.avgAssessmentIntervalDays ?? 0,
        });
      } finally {
        setLoadingSummary(false);
      }
    };

    loadSummary();
  }, []);

  // ---------------- DAU / WAU / MAU / YAU ----------------
  const dauStats: DAUStat[] = [
    {
      title: "일일 활성 사용자 (DAU)",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: Users,
      period: "전일 대비",
    },
    {
      title: "주간 활성 사용자 (WAU)",
      value: "5,832",
      change: "+8.2%",
      changeType: "increase",
      icon: Calendar,
      period: "전주 대비",
    },
    {
      title: "월간 활성 사용자 (MAU)",
      value: "18,956",
      change: "+15.7%",
      changeType: "increase",
      icon: TrendingUp,
      period: "전월 대비",
    },
    {
      title: "연간 활성 사용자 (YAU)",
      value: "156,432",
      change: "+24.3%",
      changeType: "increase",
      icon: Activity,
      period: "전년 대비",
    },
  ];

  // ---------------- 요약 통계 ----------------
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
      value: `${summary.totalAssessments.toLocaleString()}`,
      icon: ClipboardList,
    },
    {
      title: "평균 진단 간격",
      value: `${summary.avgAssessmentIntervalDays.toFixed(1)}일`,
      icon: CalendarRange,
    },
  ];

  const combinedStats: CombinedStat[] = [
    ...dauStats,
    ...summaryStats,
  ];

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {combinedStats.map((stat, index) => {
        const Icon = stat.icon;

        const isImprovement = stat.title === "전체 개선율";
        const isStable = stat.title === "안정군 비율";

        const improvementStyle = isImprovement
          ? getImprovementStyle(summary.improvementRate)
          : null;

        const stableStyle = isStable
          ? getStableStyle(summary.stableRatio)
          : null;

        const valueTextClass =
          improvementStyle?.textClass ??
          stableStyle?.textClass ??
          "";

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="space-y-2">
              {/* 값 + Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`text-2xl font-bold ${valueTextClass}`}
                >
                  {loadingSummary &&
                  index >= dauStats.length ? (
                    <LoadingSpinner />
                  ) : (
                    stat.value
                  )}
                </div>

                {!loadingSummary && improvementStyle && (
                  <>
                    {getStatusBadge(
                      improvementStyle.status,
                      "개선"
                    )}
                  </>
                )}

                {!loadingSummary && stableStyle && (
                  <>
                    {getStatusBadge(
                      stableStyle.status,
                      "안정"
                    )}
                  </>
                )}
              </div>

              {/* 변화율 */}
              {"change" in stat && (
                <div>
                  {getStatusBadge(
                    stat.changeType === "increase"
                      ? "low"
                      : "high",
                    `${stat.change} · ${stat.period}`
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
