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
import { getDiagnosisSummary, getMetricsOverview, getUserRanking } from "../API/overviewAPI";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "./ui/badge";
import { OverviewJoyride } from "./Joyride/OverviewJoyride";

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
type RankingUser = {
  weeklyCouponsUsed: number;
  userId: string;
  userName: string;
  potLevel: number;
  totalCouponsUsed: number;
};

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

export const forceLogout = (message?: string) => {
  if (message) {
    alert(message);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("me");

  window.location.href = "/login";
};

export function StatsOverview() {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loading, setLoading] = useState(true);
  const [topUser, setTopUser] = useState<RankingUser | null>(null);
  const [rankingList, setRankingList] = useState<RankingUser[]>([]);
  type RankingPeriod = "all_time" | "weekly";
  type SummaryFilter = "ALL" | "MY_GROUP";

  const [summaryFilter, setSummaryFilter] = useState<SummaryFilter>("ALL");


    const [rankingPeriod, setRankingPeriod] =
      useState<RankingPeriod>("all_time");

    const [loadingRanking, setLoadingRanking] = useState(true);

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
  const myAdminId =  localStorage.getItem("adminId") ?? undefined;
  useEffect(() => {
      if (!myAdminId) {
        forceLogout("로그인이 만료되었습니다. 다시 로그인해주세요.");
      }
    }, []);

  useEffect(() => {
    const currentAdminId = myAdminId;
  
    setLoadingSummary(true);
  
    getDiagnosisSummary({
      ...(summaryFilter === "MY_GROUP" &&
        currentAdminId && {
          filterByAdminId: currentAdminId,
        }),
    })
      .then((data) => {
        setSummary({
          improvementRate: data?.improvementRate ?? 0,
          stableRatio: data?.stableRatio ?? 0,
          totalAssessments: data?.totalAssessments ?? 0,
          avgAssessmentIntervalDays: data?.avgAssessmentIntervalDays ?? 0,
        });
      })
      .finally(() => setLoadingSummary(false));
  }, [summaryFilter]);
  

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
      }) .finally(() => 
        setLoadingMetrics(false)); }, []);

        useEffect(() => {
          setLoadingRanking(true);
        
          getUserRanking(rankingPeriod, 5)
            .then((data) => {
              setTopUser(data?.topUser ?? null);
              setRankingList(data?.rankingList ?? []);
            })
            .finally(() => setLoadingRanking(false));
        }, [rankingPeriod]);
        

  if (loadingSummary || loadingMetrics || loadingRanking)  {
    return (
      <div className="flex justify-center items-center min-h-[240px]">
        <LoadingSpinner />
      </div>
    );
  }

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

  return (
    <>
      <OverviewJoyride />
      <Card className="joyride-dau-row">
  <CardHeader className="pb-3">
    <CardTitle className="text-base">📈 사용자 활동 요약</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  `${stat.change >= 0 ? "+" : ""}${stat.change.toFixed(1)}% · ${stat.period}`
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </CardContent>
</Card>


  <Card className="mt-6 joyride-summary-row">
  <CardHeader className="flex flex-row items-center justify-between pb-3">
    <CardTitle className="text-base">📊 진단 요약</CardTitle>

    <div className="flex gap-1">
      <button
        onClick={() => setSummaryFilter("ALL")}
        className={`px-2 py-1 text-xs rounded
          ${
            summaryFilter === "ALL"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
      >
        전체
      </button>

      <button
        onClick={() => setSummaryFilter("MY_GROUP")}
        className={`px-2 py-1 text-xs rounded
          ${
            summaryFilter === "MY_GROUP"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
      >
        내 그룹
      </button>
    </div>
  </CardHeader>

  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="joyride-summary-badge">
                {improvement && getStatusBadge(improvement.status, "개선")}
                {stable && getStatusBadge(stable.status, "안정")}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </CardContent>
</Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 joyride-pot-toprank">
        {topUser && (
          <Card
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle
              className={`text-sm font-semibold
                ${
                  rankingPeriod === "weekly"
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
            >
              {rankingPeriod === "weekly"
                ? "🔥 주간 LV 1위 사용자"
                : "🏆 전체 LV 1위 사용자"}
            </CardTitle>
        
          </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">이름</span>
                <span className="font-semibold">{topUser.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">화분 레벨 (꽃 송이 수)</span>
                <span>Lv.{topUser.potLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 쿠폰 사용 수</span>
                <span>
                  {rankingPeriod === "weekly"
                    ? (topUser.weeklyCouponsUsed ?? 0).toLocaleString()
                    : (topUser.totalCouponsUsed ?? 0).toLocaleString()
                  }회
                </span>
              </div>
            </CardContent>
          </Card>
        )}

<Card>
  <CardHeader className="pb-2 flex flex-row items-center justify-between">
    <CardTitle className="text-sm">🏅 사용자 LV 순위 TOP 5</CardTitle>

    <div className="flex gap-1 joyride-pot-rank-filter">
      <button
        onClick={() => setRankingPeriod("all_time")}
        className={`px-2 py-1 text-xs rounded
          ${
            rankingPeriod === "all_time"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
                  }`}
              >
                전체
              </button>

              <button
                onClick={() => setRankingPeriod("weekly")}
                className={`px-2 py-1 text-xs rounded
                  ${
                    rankingPeriod === "weekly"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                주간
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
          {rankingList.map((user, idx) => (
          <div key={user.userId} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-medium">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
              </span>
              <span>{user.userName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground">Lv.{user.potLevel}</span>
            </div>
          </div>
        ))}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
