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
  TopFeatureItem,
} from "../API/usageAnalyticsAPI";

/* =======================
   타입
======================= */

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
  | "MEDITATION"
  | "WALKING";

/* =======================
   날짜 유틸
======================= */

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

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
    case "GAD-7": return "GAD-7 검사";
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

  const [topFeatures, setTopFeatures] = useState<TopFeatureItem[]>([]);

  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  /* ---------- TOP5 ---------- */
  useEffect(() => {
    const loadTop5 = async () => {
      try {
        setLoadingTop(true);
        const { from, to } = getDateRange(period);

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
  }, [period]);



  return (
    <div className="space-y-6">

      {/* ================= TOP 5 ================= */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>활성 기능 순위</CardTitle>

          {/* 기간 필터 */}
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as any)}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>순위</TableHead>
                <TableHead>기능명</TableHead>
                <TableHead>사용 횟수</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingTop ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : (
                topFeatures.map((f, index) => (
                  <TableRow key={f.feature}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getFeatureLabel(f.feature)}</TableCell>
                    <TableCell>
                      {f.totalSessions.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    
    </div>
  );
}
