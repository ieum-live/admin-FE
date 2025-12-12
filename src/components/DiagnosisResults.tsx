import { useState, useEffect } from "react";
import React from "react";
import { saveAs } from "file-saver";

import {
  getRecentUsers,
  exportDiagnosisCSV,
} from "../API/diagnosisAPI";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "./LoadingSpinner";

// 사용자 타입 정의
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

// 위험도 뱃지
const getStatusBadge = (risk: "LOW" | "MID" | "HIGH") => {
  if (risk === "LOW") return <Badge className="bg-green-600">안정군</Badge>;
  if (risk === "MID") return <Badge className="bg-yellow-500">주의군</Badge>;
  return <Badge className="bg-red-500">위험군</Badge>;
};

// 기간 → 날짜 범위 계산
const getDateRange = (period: string) => {
  const to = new Date();
  const from = new Date();

  if (period === "2weeks") from.setDate(to.getDate() - 14);
  if (period === "1month") from.setMonth(to.getMonth() - 1);
  if (period === "3months") from.setMonth(to.getMonth() - 3);
  if (period === "6months") from.setMonth(to.getMonth() - 6);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
};

// 차트 임시데이터 (백엔드 연동 시 실제 데이터로 교체 가능)
const improvementData = [
  { month: "1월", LOW: 40, MID: 45, HIGH: 15 },
  { month: "2월", LOW: 45, MID: 40, HIGH: 15 },
  { month: "3월", LOW: 50, MID: 35, HIGH: 15 },
  { month: "4월", LOW: 55, MID: 32, HIGH: 13 },
  { month: "5월", LOW: 58, MID: 30, HIGH: 12 },
];

export function DiagnosisResults() {
  // 필터 상태
  const [testType, setTestType] = useState<"PHQ9" | "GAD7" | "CPGI">("PHQ9");
  const [period, setPeriod] = useState<"2weeks" | "1month" | "3months" | "6months">("1month");

  // 데이터 상태
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  const totalPages = Math.ceil(users.length / usersPerPage) || 1;

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // ✔ 사용자 로드
  const loadUsers = async (testType: string, from: string, to: string) => {
    try {
      const list = await getRecentUsers();
      setUsers(list);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ✔ 필터 변경 시 전체 새로 로드
  useEffect(() => {
    const { from, to } = getDateRange(period);

    setLoadingUsers(true);

    loadUsers(testType, from, to);
    setCurrentPage(1); // 필터 바뀌면 페이지 초기화
  }, [testType, period]);

  // ✔ CSV 다운로드
  const handleExport = async () => {
    try {
      const { from, to } = getDateRange(period);

      const blob = await exportDiagnosisCSV(from, to);
      saveAs(blob, `diagnostics_${testType}_${from}_to_${to}.csv`);
    } catch (err) {
      alert("CSV 다운로드 실패");
    }
  };

  // 필터 텍스트 생성 함수
const getPeriodLabel = (period: string) => {
  switch (period) {
    case "2weeks": return "최근 2주";
    case "1month": return "최근 1개월";
    case "3months": return "최근 3개월";
    case "6months": return "최근 6개월";
    default: return "";
  }
};

const getTestLabel = (test: string) => {
  switch (test) {
    case "PHQ9": return "PHQ-9";
    case "GAD7": return "GAD-7";
    case "CPGI": return "CPGI";
    default: return "";
  }
};


  return (
    <div className="space-y-6">

      {/* ---------------------- 필터 영역 ---------------------- */}
<Card className="p-4">
  <CardHeader className="pb-2">
      필터 선택
  </CardHeader>

  <CardContent className="flex gap-4 items-center">

    {/* 검사 선택 */}
    <Select value={testType} onValueChange={(v) => setTestType(v as any)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="검사 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PHQ9">PHQ-9</SelectItem>
        <SelectItem value="GAD7">GAD-7</SelectItem>
        <SelectItem value="CPGI">CPGI</SelectItem>
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

      {/* ---------------------- 위험도 차트 ---------------------- */}
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

{/* ---------------------- 사용자 테이블 ---------------------- */}
<Card>
  <CardHeader>
    <div className="flex justify-between items-center w-full">
      <CardTitle>
        {`${getPeriodLabel(period)} 동안 · ${getTestLabel(testType)} 검사를 한 사용자`}
      </CardTitle>

      <Button variant="outline" onClick={handleExport}>
        CSV 다운로드
      </Button>
    </div>
  </CardHeader>
  
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

    </div>
  );
}
