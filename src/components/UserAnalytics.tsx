import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

import {
  getDiagnosticsTrend,
  DiagnosticsTrendItem,
  PeriodType,
} from "../API/userAnalyticsAPI";

type TrendItem = {
  label: string;
  phq9: number;
  gad7: number;
  cagi: number;
  totalUsers: number;
};

type RangeType = "2w" | "3m";

export const forceLogout = (message?: string) => {
  if (message) {
    alert(message);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("me");

  window.location.href = "/login";
};


export function UserAnalytics() {
  const [range, setRange] = useState<RangeType>("2w");
  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  const hasActivity = trendData.some(
    (d) => d.phq9 !== 0 || d.gad7 !== 0 || d.cagi !== 0 || d.totalUsers !== 0
  );

  type FilterType = "ALL" | "MY_GROUP";
  const [filter, setFilter] = useState<FilterType>("ALL");

  const mapRangeToPeriod = (range: RangeType): PeriodType => {
    if (range === "2w") return "WEEK_2";
    return "MONTH_3";
  };

  const loadTrendData = async () => {
    setLoadingTrend(true);
    try {
      const period = mapRangeToPeriod(range);
      const myAdminId =  localStorage.getItem("adminId") ?? undefined;

      const data: DiagnosticsTrendItem[] = await getDiagnosticsTrend({
        period,
        filterByAdminId: filter === "MY_GROUP" ? myAdminId : undefined,
      });

      const mapped: TrendItem[] = data.map((item) => ({
        label: item.weekLabel || "", 
        phq9: item.phq9Avg ?? 0,
        gad7: item.gad7Avg ?? 0,
        cagi: item.cagiAvg ?? 0,
        totalUsers: item.totalUsers ?? 0,
      }));

      setTrendData(mapped);
    } catch (e) {
      console.error("진단별 개선 지표 로드 실패:", e);
      setTrendData([]);
    } finally {
      setLoadingTrend(false);
    }
  };

  useEffect(() => {
    loadTrendData();
  }, [range, filter]);

  return (
    <div className="space-y-6 joyride-user-analytics">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>진단별 개선 지표</CardTitle>
            <p className="text-sm text-muted-foreground">
              기간별 평균 점수 추이 (PHQ-9 / GAD-7 / CAGI)
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <SelectTrigger className="w-[130px] joyride-user-analytics-group">
                <SelectValue placeholder="범위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="MY_GROUP">내 그룹</SelectItem>
              </SelectContent>
            </Select>

            <Select value={range} onValueChange={(v) => setRange(v as RangeType)}>
              <SelectTrigger className="w-[130px] joyride-user-analytics-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2w">최근 2주</SelectItem>
                <SelectItem value="3m">최근 3개월</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loadingTrend ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : !hasActivity ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <p className="text-lg font-medium">📉 활동이 없습니다</p>
              <p className="text-sm mt-1">
                선택한 기간 및 조건에서 진단 데이터가 존재하지 않습니다.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
  <LineChart data={trendData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="label" />
    <YAxis
      yAxisId="left"
      tickFormatter={(value) => value.toFixed(1)} // 소수점 1자리
    />
    <YAxis
      yAxisId="right"
      orientation="right"
      tickFormatter={(value) => value.toFixed(0)} // 사용자 수는 정수
    />
    <Tooltip
      formatter={(value: number, name: string) => {
        if (name === "총 사용자 수") return [value.toFixed(0), name];
        return [value.toFixed(1), name]; // 소수점 1자리
      }}
    />
    <Legend />

    <Line yAxisId="left" type="monotone" dataKey="phq9" name="PHQ-9" stroke="#8884d8" />
    <Line yAxisId="left" type="monotone" dataKey="gad7" name="GAD-7" stroke="#82ca9d" />
    <Line yAxisId="left" type="monotone" dataKey="cagi" name="CAGI" stroke="#ffc658" />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="totalUsers"
      name="총 사용자 수"
      stroke="#ff7c7c"
      strokeDasharray="5 5"
    />
  </LineChart>
</ResponsiveContainer>

          )}
        </CardContent>
      </Card>
    </div>
  );
}
