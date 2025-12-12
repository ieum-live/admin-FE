import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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

// ⭐ 타입 정의
type TrendItem = {
  label: string;
  phq9: number;
  gad7: number;
  cpgi: number;
  totalUsers: number;
};

// ⭐ 기간 타입 : 1개월 제거했다!
type RangeType = "2w" | "3m";

export function UserAnalytics() {
  const [range, setRange] = useState<RangeType>("2w");

  // ⭐ 타입 명시 → never[] 오류 해결
  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  // 랜덤값 생성 함수
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // ⭐ 2주 → 일자 데이터 생성
  const generateDailyData = (days: number): TrendItem[] => {
    const arr: TrendItem[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const label = `${d.getMonth() + 1}/${d.getDate()}`;

      arr.push({
        label,
        phq9: rand(5, 15),
        gad7: rand(3, 12),
        cpgi: rand(1, 10),
        totalUsers: rand(10, 50),
      });
    }
    return arr;
  };

  // ⭐ 3개월 → 주차 데이터 생성
  const generateWeeklyData = (): TrendItem[] => {
    const today = new Date();
    const start = new Date();
    start.setMonth(today.getMonth() - 3);

    const arr: TrendItem[] = [];
    let current = new Date(start);

    while (current <= today) {
      const month = current.getMonth() + 1;
      const week = Math.ceil(current.getDate() / 7);
      const label = `${month}/${week}주`;

      arr.push({
        label,
        phq9: rand(5, 15),
        gad7: rand(3, 12),
        cpgi: rand(1, 10),
        totalUsers: rand(20, 200),
      });

      current.setDate(current.getDate() + 7);
    }

    return arr;
  };

  // 📌 범위 변경 → 데이터 생성
  const loadTrendData = () => {
    setLoadingTrend(true);

    let data: TrendItem[] = [];

    if (range === "2w") data = generateDailyData(14);
    else data = generateWeeklyData(); // "3m"

    setTrendData(data);
    setLoadingTrend(false);
  };

  useEffect(() => {
    loadTrendData();
  }, [range]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>진단별 개선 지표</CardTitle>
            <p className="text-sm text-muted-foreground">
              기간에 따른 PHQ-9 / GAD-7 / CPGI
            </p>
          </div>

          {/* ⭐ 1개월 제거된 필터 */}
          <Select value={range} onValueChange={(v) => setRange(v as RangeType)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2w">최근 2주</SelectItem>
              <SelectItem value="3m">최근 3개월</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {loadingTrend ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="phq9"
                  name="PHQ-9"
                  stroke="#8884d8"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="gad7"
                  name="GAD-7"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cpgi"
                  name="CPGI"
                  stroke="#ffc658"
                />
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
