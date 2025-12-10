import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Download, Filter, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import React from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  age?: number;
  latestAssessment: {
    id: string;
    type: string;
    completedAt: string;
    totalScore: number;
    riskLevel: "LOW" | "MID" | "HIGH";
  };
  user: {
    email: string;
    id: string;
    name: string;
  }
}

export function DiagnosisResults() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>({
    improvementRate: 0,
    stableRatio: 0,
    totalAssessments: 0,
    avgAssessmentIntervalDays: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 📌 API 호출 - 진단 요약 지표
  const fetchSummary = async () => {
    try {
      const today = new Date();
      const to = today.toISOString().slice(0, 10);

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      const from = threeMonthsAgo.toISOString().slice(0, 10);

      const res = await fetch(`/api/diagnostics/summary?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const data = await res.json();
      console.log("API Response:", data);
      
      const summaryData = data.data ?? {};
      setSummary({
        improvementRate: summaryData.improvementRate ?? 0,
        stableRatio: summaryData.stableRatio ?? 0,
        totalAssessments: summaryData.totalAssessments ?? 0,
        avgAssessmentIntervalDays: summaryData.avgAssessmentIntervalDays ?? 0,
      });
    } catch (err) {
      console.error("진단 요약 API 호출 실패:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // 📌 API 호출 - 최근 7일 설문 사용자
  const fetchRecentUsers = async () => {
    try {
      const res = await fetch(`/api/diagnostics/recent?days=7`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const data = await res.json();
      console.log("최근 7일 설문 사용자 데이터:", data);
      setUsers(data.data || []);
    } catch (err) {
      console.error("최근 설문 사용자 API 호출 실패:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchRecentUsers();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LOW': return <Badge variant="default" className="bg-green-100 text-green-800">안정</Badge>;
      case 'MID': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'HIGH': return <Badge variant="destructive">위험</Badge>;
      default: return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getImprovementColor = (rate: string) => rate.startsWith('+') ? 'text-green-600' : 'text-red-600';

  // 페이지네이션
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(users.length / pageSize);

  // 임시 AreaChart 데이터
  const improvementData = [
    { month: '1월', low: 65, medium: 25, high: 10 },
    { month: '2월', low: 68, medium: 23, high: 9 },
    { month: '3월', low: 72, medium: 20, high: 8 },
    { month: '4월', low: 75, medium: 18, high: 7 },
    { month: '5월', low: 78, medium: 16, high: 6 },
    { month: '6월', low: 82, medium: 13, high: 5 },
  ];

  return (
    <div className="space-y-6">

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">전체 개선율</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {loadingSummary ? '불러오는 중...' : (summary.improvementRate?.toFixed(1) ?? '0')}%
            </div>
            <p className="text-sm text-muted-foreground">최근 3개월</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">안정군 비율</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {loadingSummary ? '불러오는 중...' : (summary.stableRatio?.toFixed(1) ?? '0')}%
            </div>
            <p className="text-sm text-muted-foreground">현재 기준</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">총 진단 횟수</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {loadingSummary ? '불러오는 중...' : (summary.totalAssessments?.toLocaleString() ?? '0')}
            </div>
            <p className="text-sm text-muted-foreground">최근 3개월</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">평균 진단 간격</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {loadingSummary ? '불러오는 중...' : (summary.avgAssessmentIntervalDays?.toFixed(1) ?? '0')}일
            </div>
            <p className="text-sm text-muted-foreground">사용자당</p>
          </CardContent>
        </Card>
      </div>

      {/* 위험도별 분포 추이 */}
      <Card>
        <CardHeader><CardTitle>위험도별 사용자 분포 추이</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area type="monotone" dataKey="LOW" stackId="1" stroke="#10b981" fill="#10b981" name="안정군"/>
              <Area type="monotone" dataKey="MID" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="주의군"/>
              <Area type="monotone" dataKey="HIGH" stackId="1" stroke="#ef4444" fill="#ef4444" name="위험군"/>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader><CardTitle>최근 7일 설문 사용자</CardTitle></CardHeader>
        <CardContent>
          {loadingUsers ? (
            <p>불러오는 중...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>최근 진단일</TableHead>
                    <TableHead>검사명</TableHead>
                    <TableHead>점수</TableHead>
                    <TableHead>위험도</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {paginatedUsers.map((u) => (
                  <TableRow key={u.user.id}>
                    <TableCell>{u.user.email}</TableCell>
                    <TableCell>{u.user.name}</TableCell>
                    <TableCell>
                      {new Date(u.latestAssessment.completedAt).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>{u.latestAssessment.type}</TableCell>
                    <TableCell>{u.latestAssessment.totalScore}</TableCell>
                    <TableCell>{getStatusBadge(u.latestAssessment.riskLevel)}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  이전
                </Button>
                <span className="flex items-center">{currentPage} / {totalPages}</span>
                <Button
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
                  다음
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

       {/* 필터 및 컨트롤 */}
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>진단 결과 파일 다운로드</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="3months">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> 필터</Button>
              <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> 내보내기</Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
