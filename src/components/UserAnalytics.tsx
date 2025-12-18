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

// ---------------- 타입 ----------------
type TrendItem = {
  label: string;
  phq9: number;
  gad7: number;
  cagi: number;
  totalUsers: number;
};

// UI용 기간 타입
type RangeType = "2w" | "3m";

export function UserAnalytics() {
  const [range, setRange] = useState<RangeType>("2w");
  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  // 📌 range → API period 변환
  const mapRangeToPeriod = (range: RangeType): PeriodType => {
    if (range === "2w") return "WEEK_2";
    return "MONTH_3";
  };

  // 📌 API 데이터 로드
  const loadTrendData = async () => {
    setLoadingTrend(true);
    try {
      const period = mapRangeToPeriod(range);
      
      console.log("====================================");
      console.log("📊 진단별 개선 지표 API 호출");
      console.log("📌 선택된 range:", range);
      console.log("📌 API period:", period);

      const data: DiagnosticsTrendItem[] =
        await getDiagnosticsTrend(period);

      console.log("📌 API 원본 응답 data:", data);
      console.log("📌 데이터 개수:", data.length);

      // 📌 API → 차트 데이터 변환
      const mapped: TrendItem[] = data.map((item) => ({
        label: item.weekLabel,
        phq9: item.phq9Avg,
        gad7: item.gad7Avg,
        cagi: item.cagiAvg,
        totalUsers: item.totalUsers,
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
  }, [range]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>진단별 개선 지표</CardTitle>
            <p className="text-sm text-muted-foreground">
              기간별 평균 점수 추이 (PHQ-9 / GAD-7 / CAGI)
            </p>
          </div>

          {/* 📌 그래프 내부 필터 */}
          <Select
            value={range}
            onValueChange={(v) => setRange(v as RangeType)}
          >
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
                  dataKey="cagi"
                  name="CAGI"
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
