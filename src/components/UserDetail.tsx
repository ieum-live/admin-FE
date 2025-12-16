import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Calendar, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserAssessments, getUserDetail } from "../API/userManagementAPI";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface Assessment {
  id: string;
  userId: string;
  type: 'Simple' | 'PHQ-9' | 'GAD-7' | 'BDI';
  takenDate: string;
  totalScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  version: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  depressionStatus: 'low' | 'medium' | 'high';
  gamblingStatus: 'low' | 'medium' | 'high';
  lastActive: string;
  registrationDate: string;
  diagnosisCount: number;
  lastDiagnosis: string;
  improvementRate: string;
}

interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const [user, setUser] = useState<User | null>(null);
  const [assessmentsByDate, setAssessmentsByDate] = useState<Record<string, Record<string, number>>>({});
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const detail = await getUserDetail(userId);
        const basic = detail.basic;
        const status = detail.status;
        setUser({
          id: basic.id,
          name: basic.name || "알 수 없음",
          age: new Date().getFullYear() - new Date(basic.birthDate).getFullYear(),
          gender: basic.gender || "알 수 없음",
          email: basic.email || "알 수 없음",
          depressionStatus: (status.depression?.toLowerCase() || "low") as 'low' | 'medium' | 'high',
          gamblingStatus: (status.gambling?.toLowerCase() || "low") as 'low' | 'medium' | 'high',
          lastActive: basic.updatedAt || basic.createdAt,
          registrationDate: basic.createdAt,
          diagnosisCount: status.totalAssessments || 0,
          lastDiagnosis: status.latestAssessmentDate || "-",
          improvementRate: ((detail.status.improvementRate ?? 0).toFixed(2)) + '%',
        });

        const assessments: Assessment[] = await getUserAssessments(userId);

        const types = Array.from(new Set(assessments.map(a => a.type)));
        setAvailableTypes(types);
        setSelectedTypes(new Set(types));

        const byDate: Record<string, Record<string, number>> = {};
        assessments.forEach(a => {
          if (!byDate[a.takenDate]) byDate[a.takenDate] = {};
          byDate[a.takenDate][a.type] = a.totalScore;
        });

        setAssessmentsByDate(
          Object.keys(byDate).sort().reduce((acc, d) => {
            acc[d] = byDate[d];
            return acc;
          }, {} as Record<string, Record<string, number>>)
        );

      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    loadUser();
  }, [userId]);

  if (!user) return <LoadingSpinner />;

  const chartData = Object.entries(assessmentsByDate).map(([date, scores]) => ({
    date,
    ...scores
  }));

  const lineColors: Record<string, string> = {
    Simple: "#8884d8",
    "PHQ-9": "#82ca9d",
    "GAD-7": "#ffc658",
    BDI: "#ff6b6b",
    CPGI: "#38bdf8",
    Gamble_Simple: "#a855f7",
  };

  const lastActiveTime = user.lastActive ? new Date(user.lastActive).getTime() : 0;
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const activityData = [
    { feature: '자가진단', sessions: 12, avgTime: 8.5 },
    { feature: '교육 콘텐츠', sessions: 8, avgTime: 15.2 },
    { feature: '상담 예약', sessions: 2, avgTime: 5.1 },
    { feature: '커뮤니티', sessions: 6, avgTime: 12.3 },
  ];

  const getStatusBadge = (status: string, type: 'depression' | 'gambling') => {
    const baseClasses = "text-xs";
    switch (status) {
      case 'low':
        return (
          <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800`}>
            {type === 'depression' ? '안정' : '낮음'}
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {type === 'depression' ? '주의' : '중간'}
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="destructive" className={baseClasses}>
            {type === 'depression' ? '위험' : '높음'}
          </Badge>
        );
      default:
        return <Badge variant="outline" className={baseClasses}>알 수 없음</Badge>;
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
  
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월
    const dd = String(date.getDate()).padStart(2, '0');      // 일
    const hh = String(date.getHours()).padStart(2, '0');     // 시
    const min = String(date.getMinutes()).padStart(2, '0');  // 분
  
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };
  

  return (
    <>
      <style>
        {`
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            height: 100vh; 
          }
          .dashboard-column {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 1rem;
            height: 100%;
          }
          .dashboard-card {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .dashboard-card-content {
            flex: 1;
            overflow: auto;
            min-height: 300px; /* 차트가 잘리는 문제 방지 */
          }
        `}
      </style>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="dashboard-card-content space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">사용자 ID</span>
                <span className="font-medium">{user.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">이름</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">나이</span>
                <span className="font-medium">{user.age}세</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">성별</span>
                <span className="font-medium">{user.gender}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">이메일</span>
                <span className="font-medium truncate ml-2">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">가입일</span>
                <span className="font-medium">{formatDateTime(user.registrationDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">최근 활동</span>
                <span className="font-medium">{formatDateTime(user.lastActive)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                현재 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="dashboard-card-content space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">우울증 상태</span>
                {getStatusBadge(user.depressionStatus, 'depression')}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">도박 위험도</span>
                {getStatusBadge(user.gamblingStatus, 'gambling')}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">총 진단 횟수</span>
                <span className="font-medium">{user.diagnosisCount}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">최근 진단일</span>
                <span className="font-medium">{user.lastDiagnosis}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">평균 진단 간격</span>
                <span className="font-medium">8일</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">개선율</span>
                <span className={`font-medium ${user.improvementRate.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {user.improvementRate}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t space-y-1.5">
                <div className="font-medium text-sm mb-1.5">위험 요소</div>
                {user.depressionStatus === 'high' && (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>우울증 고위험군</span>
                  </div>
                )}
                {user.gamblingStatus === 'high' && (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>도박 중독 고위험군</span>
                  </div>
                )}
                {lastActiveTime && Date.now() - lastActiveTime > oneWeekMs && (
                  <div className="flex items-center gap-1.5 text-orange-600 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>장기간 비활성</span>
                  </div>
                )}
                {lastActiveTime && user.depressionStatus !== 'high' && user.gamblingStatus !== 'high' &&
                  Date.now() - lastActiveTime <= oneWeekMs && (
                    <div className="text-green-600 text-xs">
                      현재 위험 요소 없음
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="dashboard-column">
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                진단 점수 추이
              </CardTitle>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableTypes.map(type => (
                  <label key={type} className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(type)}
                      onChange={() => {
                        const next = new Set(selectedTypes);
                        next.has(type) ? next.delete(type) : next.add(type);
                        setSelectedTypes(next);
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </CardHeader>
            <CardContent className="dashboard-card-content">
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} /> {/* 자동 범위 */}
                <Tooltip contentStyle={{ fontSize: 12 }} />
                {availableTypes
                  .filter(type => selectedTypes.has(type))
                  .map(type => (
                    <Line
                      key={type}
                      type="monotone"
                      dataKey={type}
                      stroke={lineColors[type] ?? "#64748b"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls={true} // null 값이 있어도 선 이어주기
                      name={type}
                    />
                  ))}
              </LineChart>

              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기능별 활동 패턴
              </CardTitle>
            </CardHeader>
            <CardContent className="dashboard-card-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="세션 수" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgTime" fill="#82ca9d" name="평균 시간 (분)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
