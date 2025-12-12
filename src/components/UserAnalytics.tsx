import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface UserAnalyticsProps {
  showUsageChart?: boolean;
}

export function UserAnalytics() {

  const [trendData, setTrendData] = useState<any[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  // 📌 오늘 기준 최근 3개월 날짜 계산 함수
  const getLast3MonthsRange = () => {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const from = threeMonthsAgo.toISOString().slice(0, 10);

    return { from, to };
  };

  // 📌 1. 진단 추세 API 호출
  const fetchTrendData = async () => {
    try {
      const { from, to } = getLast3MonthsRange();
      console.log("📌 조회 기간:", from, "~", to);
  
      const res = await fetch(
        `/api/metrics/diagnostics/trend?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      const json = await res.json();
      console.log("📌 API 응답:", json);
  
      // 1️⃣ 최근 3개월 주차 리스트 생성
      const generateWeekLabels = () => {
        const labels: string[] = [];
        const today = new Date();
        const start = new Date();
        start.setMonth(today.getMonth() - 3);
  
        let current = new Date(start);
        while (current <= today) {
          const month = current.getMonth() + 1;
          const week = Math.ceil(current.getDate() / 7);
          const label = `${month}/${week}주`;
          if (!labels.includes(label)) labels.push(label);
          current.setDate(current.getDate() + 7); // 1주 단위 증가
        }
        return labels;
      };
  
      const weekLabels = generateWeekLabels();
  
      // 2️⃣ API 데이터 매핑
      const dataArray = Array.isArray(json.data) ? json.data : [];
      const dataMap: Record<string, any> = {};
      dataArray.forEach((item) => {
        dataMap[item.weekLabel] = item;
      });
  
      // 3️⃣ 모든 주차에 대해 값 채우기, 없으면 0으로
      const filledData = weekLabels.map((week) => {
        const item = dataMap[week];
        return {
          week,
          phq9: item?.phq9Avg ?? 0,
          gad7: item?.gad7Avg ?? 0,
          cpgi: item?.cpgiAvg ?? 0,
          totalUsers: item?.totalUsers ?? 0,
        };
      });
  
      console.log("📌 주차별 평균 점수 (0 포함)");
      filledData.forEach((w) => {
        console.log(
          `${w.week}: PHQ-9=${w.phq9}, GAD-7=${w.gad7}, CPGI=${w.cpgi}, 사용자수=${w.totalUsers}`
        );
      });
  
      setTrendData(filledData);
    } catch (err) {
      console.error("진단 추세 불러오기 실패:", err);
    } finally {
      setLoadingTrend(false);
    }
  };
  

  useEffect(() => {
    fetchTrendData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 진단별 개선 지표 */}
      <Card>
        <CardHeader>
          <CardTitle>진단별 개선 지표 (최근 3개월)</CardTitle>
          <p className="text-sm text-muted-foreground">
            검사별 평균 점수 추이 및 총 사용자 수
          </p>
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
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="phq9" stroke="#8884d8" name="PHQ-9" />
              <Line yAxisId="left" type="monotone" dataKey="gad7" stroke="#82ca9d" name="GAD-7" />
              <Line yAxisId="left" type="monotone" dataKey="cpgi" stroke="#ffc658" name="CPGI" />
              <Line yAxisId="right" type="monotone" dataKey="totalUsers" stroke="#ff7c7c" strokeDasharray="5 5" name="총 사용자 수" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      </Card>
    </div>
  );
}
