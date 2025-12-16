import { useEffect, useState } from "react";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "./ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "./ui/table";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import LoadingSpinner from "./LoadingSpinner";
import {
  getTop5Features,
  getFeatureUsageTrend,
  TopFeatureItem,
  FeatureTrendItem,
} from "../API/usageAnalyticsAPI";

/* =======================
   타입
======================= */

type TopPeriod = "today" | "2weeks" | "1month";
type UiPeriod = "2weeks" | "1month" | "3months" | "6months";
type ApiPeriod = "WEEK_2" | "MONTH_1" | "MONTH_3" | "MONTH_6";

const periodToApi: Record<UiPeriod, ApiPeriod> = {
  "2weeks": "WEEK_2",
  "1month": "MONTH_1",
  "3months": "MONTH_3",
  "6months": "MONTH_6",
};


type PeriodType = "2weeks" | "1month" | "3months" | "6months";
type FeatureType =
  | "PHQ9"
  | "DAILY_TOPIC"
  | "DIARY"
  | "MEDITATION_QUEST"
  | "ACTIVITY_QUEST";

/* =======================
   날짜 유틸
======================= */

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

const getTopDateRange = (period: TopPeriod) => {
  const today = new Date();
  const to = formatDate(today);
  const from = new Date(today);

  switch (period) {
    case "today":
      // 오늘 하루
      return { from: to, to };

    case "2weeks":
      from.setDate(today.getDate() - 13);
      return { from: formatDate(from), to };

    case "1month":
      from.setMonth(today.getMonth() - 1);
      return { from: formatDate(from), to };
  }
};


const getDateRange = (period: PeriodType) => {
  const today = new Date();
  const to = formatDate(today);
  const from = new Date(today);

  if (period === "2weeks") from.setDate(today.getDate() - 13);
  if (period === "1month") from.setMonth(today.getMonth() - 1);
  if (period === "3months") from.setMonth(today.getMonth() - 3);
  if (period === "6months") from.setMonth(today.getMonth() - 6);

  return { from: formatDate(from), to };
};

/* =======================
   라벨
======================= */

const getPeriodLabel = (p: PeriodType) => {
  switch (p) {
    case "2weeks": return "최근 2주";
    case "1month": return "최근 1개월";
    case "3months": return "최근 3개월";
    case "6months": return "최근 6개월";
  }
};

const getFeatureLabel = (f: string) => {
  switch (f) {
    case "PHQ9": return "PHQ-9 검사";
    case "GAD7": return "GAD-7 검사";
    case "CPGI": return "CPGI 검사";
    case "DAILY_TOPIC": return "매일 1주제";
    case "DIARY": return "일기";
    case "MEDITATION_QUEST": return "명상 퀘스트";
    case "ACTIVITY_QUEST": return "산책 퀘스트";
    default: return f;
  }
};

/* =======================
   컴포넌트
======================= */

export function UsageAnalytics() {
  const [period, setPeriod] = useState<PeriodType>("2weeks");
  const [feature, setFeature] = useState<FeatureType>("PHQ9");

  const [topPeriod, setTopPeriod] = useState<TopPeriod>("today");
  const [chartPeriod, setChartPeriod] = useState<PeriodType>("2weeks");

  const [topFeatures, setTopFeatures] = useState<TopFeatureItem[]>([]);
  const [chartData, setChartData] = useState<FeatureTrendItem[]>([]);

  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  /* ---------- TOP5 ---------- */
  useEffect(() => {
    const loadTop5 = async () => {
      try {
        setLoadingTop(true);
  
        const { from, to } = getTopDateRange(topPeriod);
        console.log("TOP5 조회 범위:", { from, to });
  
        const data = await getTop5Features(from, to);
        setTopFeatures(data);
      } catch (e) {
        console.error("TOP5 기능 조회 실패", e);
      } finally {
        setLoadingTop(false);
      }
    };
  
    loadTop5();
  }, [topPeriod]);
  

  /* ---------- 그래프 ---------- */
  /* ---------- 그래프 ---------- */
useEffect(() => {
  const loadTrend = async () => {
    try {
      setLoadingChart(true);

      const apiPeriod = periodToApi[period];
      console.log("📈 트렌드 조회:", feature, apiPeriod);

      const res = await getFeatureUsageTrend(feature, apiPeriod);

        console.log("🔥 그래프 raw 응답", res);
        console.log("🔥 그래프에 들어갈 배열", res.data);

        setChartData(res.data); // ✅ 배열

    } catch (e) {
      console.error("❌ 트렌드 조회 실패 (catch 진입)", e);
      setChartData([]);
    } finally {
      setLoadingChart(false);
    }
  };

  loadTrend();
}, [feature, period]);

  

  return (
    <div className="space-y-6">

      {/* ================= TOP 5 ================= */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>활성 기능 순위</CardTitle>

          {/* 기간 필터 */}
          <Select
            value={topPeriod}
            onValueChange={(v) => setTopPeriod(v as TopPeriod)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="2weeks">최근 2주</SelectItem>
              <SelectItem value="1month">최근 1개월</SelectItem>
            </SelectContent>
          </Select>

        </CardHeader>

        <CardContent>
            {loadingTop ? (
              <LoadingSpinner />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>순위</TableHead>
                    <TableHead>기능명</TableHead>
                    <TableHead>사용 횟수</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {topFeatures.map((f, index) => (
                    <TableRow key={f.feature}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{getFeatureLabel(f.feature)}</TableCell>
                      <TableCell>
                        {f.totalSessions.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
      </Card>

      {/* ================= 필터 ================= */}
      <Card>
        <CardHeader>
          <CardTitle>필터 선택</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          <Select value={feature} onValueChange={(v) => setFeature(v as FeatureType)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHQ9">PHQ-9</SelectItem>
              <SelectItem value="GAD7">GAD-7</SelectItem>
              <SelectItem value="CPGI">CPGI</SelectItem>
              <SelectItem value="DAILY_TOPIC">매일 1주제</SelectItem>
              <SelectItem value="DIARY">일기</SelectItem>
              <SelectItem value="MEDITATION_QUEST">명상 퀘스트</SelectItem>
              <SelectItem value="ACTIVITY_QUEST">산책 퀘스트</SelectItem>

            </SelectContent>
          </Select>

          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2weeks">최근 2주</SelectItem>
              <SelectItem value="1month">최근 1개월</SelectItem>
              <SelectItem value="3months">최근 3개월</SelectItem>
              <SelectItem value="6months">최근 6개월</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= 그래프 ================= */}
      <Card>
        <CardHeader>
          <CardTitle>
            {`${getFeatureLabel(feature)} · ${getPeriodLabel(period)} 사용 추세`}
          </CardTitle>
        </CardHeader>

        <CardContent>
  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => v.slice(5)}
        />
        <YAxis domain={[0, "dataMax + 10"]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          fill="#93c5fd"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</CardContent>


      </Card>
    </div>
  );
}
