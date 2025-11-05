import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface UserAnalyticsProps {
  showUsageChart?: boolean;
}

export function UserAnalytics({ showUsageChart = true }: UserAnalyticsProps) {
  // 진단별 개선 지표 데이터 (지난 3개월, 주차별)
  const diagnosisImprovementData = [
    { week: '7/1주', phq9: 13.2, gad7: 11.5, cpgi: 9.8, totalUsers: 142 },
    { week: '7/2주', phq9: 12.9, gad7: 11.1, cpgi: 9.4, totalUsers: 156 },
    { week: '7/3주', phq9: 12.5, gad7: 10.7, cpgi: 9.0, totalUsers: 168 },
    { week: '7/4주', phq9: 12.1, gad7: 10.3, cpgi: 8.6, totalUsers: 179 },
    { week: '8/1주', phq9: 11.8, gad7: 10.0, cpgi: 8.3, totalUsers: 193 },
    { week: '8/2주', phq9: 11.5, gad7: 9.7, cpgi: 8.1, totalUsers: 207 },
    { week: '8/3주', phq9: 11.1, gad7: 9.4, cpgi: 7.8, totalUsers: 221 },
    { week: '8/4주', phq9: 10.7, gad7: 9.0, cpgi: 7.5, totalUsers: 238 },
    { week: '9/1주', phq9: 10.4, gad7: 8.7, cpgi: 7.2, totalUsers: 253 },
    { week: '9/2주', phq9: 10.0, gad7: 8.4, cpgi: 6.9, totalUsers: 270 },
    { week: '9/3주', phq9: 9.6, gad7: 8.1, cpgi: 6.6, totalUsers: 287 },
    { week: '9/4주', phq9: 9.2, gad7: 7.8, cpgi: 6.3, totalUsers: 304 },
  ];

  // 기능별 사용시간 데이터
  const usageTimeData = [
    { feature: '자가진단', time: 245, sessions: 1420 },
    { feature: '교육 콘텐츠', time: 320, sessions: 890 },
    { feature: '상담 예약', time: 120, sessions: 345 },
    { feature: '진단 결과', time: 180, sessions: 1230 },
    { feature: '커뮤니티', time: 95, sessions: 567 },
  ];

  return (
    <div className="space-y-6">
      {/* 진단별 개선 지표 */}
      <Card>
        <CardHeader>
          <CardTitle>진단별 개선 지표 (지난 3개월)</CardTitle>
          <p className="text-sm text-muted-foreground">검사별 평균 점수 추이 및 총 사용자 수 (주차별)</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={diagnosisImprovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" label={{ value: '평균 점수', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: '총 사용자 수', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="phq9" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="PHQ-9 (우울증)"
                dot={{ fill: '#8884d8', r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="gad7" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="GAD-7 (불안)"
                dot={{ fill: '#82ca9d', r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="cpgi" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="CPGI (도박)"
                dot={{ fill: '#ffc658', r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalUsers" 
                stroke="#ff7c7c" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="총 사용자 수"
                dot={{ fill: '#ff7c7c', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 기능별 사용시간 (조건부 렌더링) */}
      {showUsageChart && (
        <Card>
          <CardHeader>
            <CardTitle>기능별 사용시간 및 세션 수</CardTitle>
            <p className="text-sm text-muted-foreground">각 기능의 평균 사용시간과 총 세션 수</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={usageTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis yAxisId="left" label={{ value: '사용시간 (초)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '세션 수', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="time" fill="#8884d8" name="평균 사용시간 (초)" />
                <Bar yAxisId="right" dataKey="sessions" fill="#82ca9d" name="총 세션 수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>전체 재방문율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">42.8%</div>
            <p className="text-sm text-muted-foreground mt-2">
              지난 30일 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>평균 세션 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">8분 32초</div>
            <p className="text-sm text-muted-foreground mt-2">
              사용자당 평균
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>일평균 세션 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">3,247</div>
            <p className="text-sm text-muted-foreground mt-2">
              최근 7일 평균
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}