import { useState, useEffect } from "react";
import React from "react";
import { saveAs } from "file-saver";

import {
  getDiagnosisSummary,
  getRecentUsers,
  exportDiagnosisCSV,
} from "../API/diagnosisAPI";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import LoadingSpinner from "./LoadingSpinner";

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
  };
}

const getStatusBadge = (risk: "LOW" | "MID" | "HIGH") => {
  if (risk === "LOW")
    return <Badge className="bg-green-600">안정군</Badge>;
  if (risk === "MID")
    return <Badge className="bg-yellow-500">주의군</Badge>;
  return <Badge className="bg-red-500">위험군</Badge>;
};


const improvementData = [
  { month: "1월", LOW: 40, MID: 45, HIGH: 15 },
  { month: "2월", LOW: 45, MID: 40, HIGH: 15 },
  { month: "3월", LOW: 50, MID: 35, HIGH: 15 },
  { month: "4월", LOW: 55, MID: 32, HIGH: 13 },
  { month: "5월", LOW: 58, MID: 30, HIGH: 12 },
];

export function DiagnosisResults() {
  const [summary, setSummary] = useState<any>({});
  const [users, setUsers] = useState<UserData[]>([]);
  
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [exportPeriod, setExportPeriod] = useState<"1month" | "3months" | "6months">("3months");


  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  const totalPages = Math.ceil(users.length / usersPerPage) || 1;

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const loadSummary = async () => {
    try {
      const data = await getDiagnosisSummary();
      setSummary({
        improvementRate: data.improvementRate ?? 0,
        stableRatio: data.stableRatio ?? 0,
        totalAssessments: data.totalAssessments ?? 0,
        avgAssessmentIntervalDays: data.avgAssessmentIntervalDays ?? 0,
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadUsers = async () => {
    try {
      const list = await getRecentUsers();
      setUsers(list);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 최초 로드
  useEffect(() => {
    loadSummary();
    loadUsers();
  }, []);

  const handleExport = async () => {
    try {
      const today = new Date();
      const to = today.toISOString().slice(0, 10);

      const fromDate = new Date();
      if (exportPeriod === "1month") fromDate.setMonth(today.getMonth() - 1);
      if (exportPeriod === "3months") fromDate.setMonth(today.getMonth() - 3);
      if (exportPeriod === "6months") fromDate.setMonth(today.getMonth() - 6);

      const from = fromDate.toISOString().slice(0, 10);

      const blob = await exportDiagnosisCSV(from, to);
      saveAs(blob, `diagnostics_${from}_to_${to}.csv`);
    } catch (err) {
      alert("파일 다운로드 실패");
    }
  };


  return (
    <div className="space-y-6">
      
      {/* 📌 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">전체 개선율</CardTitle></CardHeader>
          <CardContent>
            {loadingSummary ? (
              <LoadingSpinner />
            ) : (
              <div className="text-2xl font-semibold text-green-600">
                {summary.improvementRate?.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">안정군 비율</CardTitle></CardHeader>
          <CardContent>
            {loadingSummary ? (
              <LoadingSpinner />
            ) : (
              <div className="text-2xl font-semibold">
                {summary.stableRatio?.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">총 진단 횟수</CardTitle></CardHeader>
          <CardContent>
            {loadingSummary ? (
              <LoadingSpinner />
            ) : (
              <div className="text-2xl font-semibold">
                {summary.totalAssessments?.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">평균 진단 간격</CardTitle></CardHeader>
          <CardContent>
            {loadingSummary ? (
              <LoadingSpinner />
            ) : (
              <div className="text-2xl font-semibold">
                {summary.avgAssessmentIntervalDays?.toFixed(1)}일
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 📌 차트 */}
      <Card>
        <CardHeader><CardTitle>위험도별 사용자 분포 추이</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area type="monotone" dataKey="LOW" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="MID" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="HIGH" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📌 사용자 테이블 */}
      <Card>
        <CardHeader><CardTitle>최근 7일 설문 사용자</CardTitle></CardHeader>
        <CardContent>
          {loadingUsers ? (
            <LoadingSpinner />
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
                        {new Date(u.latestAssessment.completedAt).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>{u.latestAssessment.type}</TableCell>
                      <TableCell>{u.latestAssessment.totalScore}</TableCell>
                      <TableCell>{getStatusBadge(u.latestAssessment.riskLevel)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              <div className="flex justify-end mt-3 gap-2">
                <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  이전
                </Button>
                <span>{currentPage} / {totalPages}</span>
                <Button size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  다음
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 📌 CSV 다운로드 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>진단 결과 다운로드</CardTitle>

            <div className="flex gap-2">
              <Select value={exportPeriod} onValueChange={(v) => setExportPeriod(v as any)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExport}>
                CSV 다운로드
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
