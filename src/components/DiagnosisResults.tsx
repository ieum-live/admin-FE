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

export function DiagnosisResults() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>({
    improvementRate: 0,
    stableRatio: 0,
    totalAssessments: 0,
    avgAssessmentIntervalDays: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);

  // 📌 API 호출 - 진단 요약 지표
  const fetchSummary = async () => {
    try {
      const today = new Date();
      const to = today.toISOString().slice(0, 10);

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      const from = threeMonthsAgo.toISOString().slice(0, 10);

      const res = await fetch(`/api/diagnostics/summary?from=${from}&to=${to}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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

  useEffect(() => {
    fetchSummary();
  }, []);

  // 임시 AreaChart 데이터 (위험도별 분포)
  const improvementData = [
    { month: '1월', low: 65, medium: 25, high: 10 },
    { month: '2월', low: 68, medium: 23, high: 9 },
    { month: '3월', low: 72, medium: 20, high: 8 },
    { month: '4월', low: 75, medium: 18, high: 7 },
    { month: '5월', low: 78, medium: 16, high: 6 },
    { month: '6월', low: 82, medium: 13, high: 5 },
  ];

  // 사용자 테이블 예시
  const diagnosisData = [
    { id: 'USR001', name: '김**', age: 16, lastDiagnosis: '2024-10-05', currentStatus: 'low', improvementRate: '+25%', diagnosisCount: 8 },
    { id: 'USR002', name: '이**', age: 17, lastDiagnosis: '2024-10-04', currentStatus: 'medium', improvementRate: '+10%', diagnosisCount: 5 },
    { id: 'USR003', name: '박**', age: 15, lastDiagnosis: '2024-10-03', currentStatus: 'high', improvementRate: '-5%', diagnosisCount: 12 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low': return <Badge variant="default" className="bg-green-100 text-green-800">안정</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'high': return <Badge variant="destructive">위험</Badge>;
      default: return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getImprovementColor = (rate: string) => rate.startsWith('+') ? 'text-green-600' : 'text-red-600';

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
              <Area type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" name="안정군"/>
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="주의군"/>
              <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" name="위험군"/>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader><CardTitle>최근 설문 사용자</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>연령</TableHead>
                <TableHead>최근 진단일</TableHead>
                <TableHead>현재 상태</TableHead>
                <TableHead>개선율</TableHead>
                <TableHead>진단 횟수</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnosisData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.age}세</TableCell>
                  <TableCell>{user.lastDiagnosis}</TableCell>
                  <TableCell>{getStatusBadge(user.currentStatus)}</TableCell>
                  <TableCell className={getImprovementColor(user.improvementRate)}>
                    {user.improvementRate}
                  </TableCell>
                  <TableCell>{user.diagnosisCount}회</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user.id)}>
                          <FileText className="h-4 w-4" /> 설문 내용
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{user.name} ({user.id}) 설문 응답</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">설문 내용 표시 영역 (예시 데이터)</div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
