import { useEffect, useState } from "react";
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

import { Button } from "./ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import React from "react";

// --------------------- MOCK DATA ---------------------
const mockTopFeatures = [
  { feature: "PHQ9", count: 1420 },
  { feature: "DAILY_TOPIC", count: 980 },
  { feature: "DIARY", count: 720 },
  { feature: "MEDITATION", count: 610 },
  { feature: "WALKING", count: 420 },
];

// --------------------- 차트 mock 데이터 생성 ---------------------
const generateMockTrendData = (period: string, feature: string) => {
  const today = new Date();

  const addDays = (d: number) => {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() - d);
    return newDate;
  };

  const formatDate = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}`;

  let length = 14;
  if (period === "1month") length = 30;
  if (period === "3months") length = 12;
  if (period === "6months") length = 6;

  const data: any[] = [];

  // --- 📌 1개월(4주차) ---
  if (period === "1month") {
    const weeks = 4;

    for (let i = 1; i <= weeks; i++) {
      data.push({
        label: `${i}주차`,
        count: Math.floor(Math.random() * 200) + 20,
      });
    }
    // DAILY_TOPIC → dropoutRate 추가
    if (feature === "DAILY_TOPIC") {
      return data.map((d) => ({
        ...d,
        dropoutRate: Math.floor(Math.random() * 40), // 0~40%
      }));
    }
    return data;
  }

  // --- 📌 기본 기간 생성 (2주/3개월/6개월) ---
  for (let i = length - 1; i >= 0; i--) {
    let label = "";

    if (period === "2weeks") {
      label = formatDate(addDays(i));
    } else if (period === "3months") {
      label = `${12 - i}주차`;
    } else if (period === "6months") {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      label = `${date.getMonth() + 1}월`;
    }

    data.push({
      label,
      count: Math.floor(Math.random() * 120) + 10,
    });
  }

  // DAILY_TOPIC → dropoutRate 추가
  if (feature === "DAILY_TOPIC") {
    return data.map((d) => ({
      ...d,
      dropoutRate: Math.floor(Math.random() * 40),
    }));
  }

  return data;
};

// --------------------- PAGE COMPONENT ---------------------
export function UsageAnalytics() {
  const [period, setPeriod] = useState<"2weeks" | "1month" | "3months" | "6months">("2weeks");
  const [feature, setFeature] = useState<string>("PHQ9");

  const [topFeatures] = useState(mockTopFeatures);
  const [chartData, setChartData] = useState<{ label: string; count: number; dropoutRate?: number }[]>([]);

  // ---------- 기간 라벨 ----------
  const getPeriodLabel = (p: string) => {
    switch (p) {
      case "2weeks": return "최근 2주";
      case "1month": return "최근 1개월";
      case "3months": return "최근 3개월";
      case "6months": return "최근 6개월";
      default: return "";
    }
  };

  // ---------- 기능 라벨 ----------
  const getFeatureLabel = (f: string) => {
    switch (f) {
      case "PHQ9": return "PHQ9";
      case "DAILY_TOPIC": return "매일 1주제";
      case "DIARY": return "일기";
      case "MEDITATION": return "명상 퀘스트";
      case "WALKING": return "산책 퀘스트";
      default: return "";
    }
  };

  // ---------- mock 데이터 생성 ----------
  useEffect(() => {
    const generated = generateMockTrendData(period, feature);
    setChartData(generated);
  }, [period, feature]);

  return (
    <div className="space-y-6">

      {/* ------------------------ TOP 기능 ------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>사용자들이 가장 많이 사용하는 기능 TOP 5</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>순위</TableHead>
                <TableHead>기능명</TableHead>
                <TableHead>전체 사용 횟수</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {topFeatures.map((f, index) => (
                <TableRow key={f.feature}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{getFeatureLabel(f.feature)}</TableCell>
                  <TableCell>{f.count.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------------------- 필터 영역 ---------------------- */}
      <Card className="p-4">
        <CardHeader className="pb-2">필터 선택</CardHeader>

        <CardContent className="flex gap-4 items-center">

          {/* 기능 선택 */}
          <Select value={feature} onValueChange={(v) => setFeature(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="기능 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHQ9">PHQ-9 검사</SelectItem>
              <SelectItem value="DAILY_TOPIC">매일 1주제</SelectItem>
              <SelectItem value="DIARY">일기</SelectItem>
              <SelectItem value="MEDITATION">명상 퀘스트</SelectItem>
              <SelectItem value="WALKING">산책 퀘스트</SelectItem>
            </SelectContent>
          </Select>

          {/* 기간 선택 */}
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="기간 선택" />
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

      {/* ---------------------- 사용 추세 그래프 ---------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>
            {`${getFeatureLabel(feature)} · ${getPeriodLabel(period)} 사용 추세`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />

              <Tooltip />

              {/* 사용량 */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="#3b82f6"
              />

              {/* DAILY_TOPIC일 때만 이탈률 라인 표시 */}
              {feature === "DAILY_TOPIC" && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dropoutRate"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
