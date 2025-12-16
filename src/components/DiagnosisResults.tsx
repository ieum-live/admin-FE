import { useState, useEffect } from "react";
import React from "react";
import { saveAs } from "file-saver";

import {
  getRecentUsers,
  exportDiagnosisCSV,
  getRiskDistributionTrend,
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

export function DiagnosisResults() {
  // 필터 상태
  type TestTypeUI = "PHQ9" | "GAD7" | "CPGI";
  const [testType, setTestType] = useState<TestTypeUI>("PHQ9");

  const [period, setPeriod] = useState<"2weeks" | "1month" | "3months" | "6months">("1month");

  // 데이터 상태
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  

  const [riskTrend, setRiskTrend] = useState<any[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);


  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  
  const TEST_TYPE_TO_API: Record<
      TestTypeUI,
      "PHQ-9" | "GAD-7" | "CPGI"
    > = {
      PHQ9: "PHQ-9",
      GAD7: "GAD-7",
      CPGI: "CPGI",
    };

    const loadRiskTrend = async () => {
      try {
        setLoadingTrend(true);
    
        const apiType = TEST_TYPE_TO_API[testType];
        const raw = await getRiskDistributionTrend(apiType, period);
        console.log("raw", raw);
    
        const chartData = transformRiskTrend(raw, testType); // testType 전달
        console.log("📊 chartData", chartData);
    
        setRiskTrend(chartData);
      } catch (err) {
        console.error(err);
        setRiskTrend([]);
      } finally {
        setLoadingTrend(false);
      }
    };
    
    
    
    const transformRiskTrend = (rawData: any[], testType: TestTypeUI) => {
      const map = new Map<string, any>();
      const SCALE_TO_RISK = SCALE_TO_RISK_MAP[testType];
    
      // 1. userCount 누적
      rawData.forEach((item) => {
        const { label, scaleName, userCount } = item;
        const risk = SCALE_TO_RISK[scaleName];
        if (!risk) return;
    
        if (!map.has(label)) {
          map.set(label, {
            label,
            LOW: 0,
            MID: 0,
            HIGH: 0,
            TOTAL: 0,
          });
        }
    
        const target = map.get(label);
        target[risk] += userCount;
        target.TOTAL += userCount;
      });
    
      // 2. 퍼센트로 변환
      return Array.from(map.values()).map((item) => ({
        label: item.label,
        LOW: item.TOTAL ? +(item.LOW / item.TOTAL * 100).toFixed(1) : 0,
        MID: item.TOTAL ? +(item.MID / item.TOTAL * 100).toFixed(1) : 0,
        HIGH: item.TOTAL ? +(item.HIGH / item.TOTAL * 100).toFixed(1) : 0,
      }));
    };
    
  

  // 검사별 SCALE → RISK 매핑
const SCALE_TO_RISK_MAP: Record<TestTypeUI, Record<string, "LOW" | "MID" | "HIGH">> = {
  PHQ9: {
    "정상": "LOW",
    "가벼운 우울증": "LOW",
    "중간정도 우울증": "MID",
    "심한 우울증": "HIGH",
  },
  GAD7: {
    "정상": "LOW",
    "불안 시사됨": "HIGH",
  },
  CPGI: {
    "일반군": "LOW",
    "문제군": "MID",
    "위험군": "HIGH",
  },
};
  

  useEffect(() => {
    const { from, to } = getDateRange(period);
  
    setLoadingUsers(true);
    loadUsers(testType, period);
    loadRiskTrend();
    setCurrentPage(1);
  }, [testType, period]);

  const mapScaleToRisk = (testType: TestTypeUI, scaleName: string): "LOW" | "MID" | "HIGH" => {
    const SCALE_TO_RISK = SCALE_TO_RISK_MAP[testType];
    return SCALE_TO_RISK[scaleName] || "LOW";
  };
  
  
const loadUsers = async (
  testType: TestTypeUI,
  period: "2weeks" | "1month" | "3months" | "6months",
  page: number = 0,
  size: number = 7
) => {
  try {
    setLoadingUsers(true);

    const apiType = TEST_TYPE_TO_API[testType];
    const res = await getRecentUsers({ type: apiType, period, page, size });

    // 서버 데이터 → 화면용 UserData로 변환
    const mappedUsers: UserData[] = res.content.map(u => ({
      id: u.email,
      name: u.name,
      email: u.email,
      latestAssessment: {
        id: u.email,
        type: u.testName,
        completedAt: u.lastDiagnosisDate,
        totalScore: u.score,
        riskLevel: mapScaleToRisk(testType, u.scaleName),
      },
      user: {
        email: u.email,
        id: u.email,
        name: u.name,
      }
    }));
    console.log("ttt", mappedUsers)
    setUsers(mappedUsers);
    setTotalUsers(res.page.totalElements);
    setTotalPages(res.page.totalPages);
  } catch (err) {
    console.error(err);
    setUsers([]);
    setTotalUsers(0);
    setTotalPages(1);
  } finally {
    setLoadingUsers(false);
  }
};

// 위험도 뱃지
const getStatusBadge = (risk: "LOW" | "MID" | "HIGH") => {
    const baseClasses = "text-xs";
    switch (risk) {
      case 'LOW':
        return (
          <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800`}>
            안정
          </Badge>
        );
      case 'MID':
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          주의
          </Badge>
        );
      case 'HIGH':
        return (
          <Badge variant="destructive" className={baseClasses}>
            위험
          </Badge>
        );
      default:
        return <Badge variant="outline" className={baseClasses}>알 수 없음</Badge>;
    }
  };


useEffect(() => {
  loadUsers(testType, period, currentPage - 1, usersPerPage);
}, [testType, period, currentPage]);

  
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
  <CardHeader>
    <CardTitle>위험도별 사용자 분포 추이</CardTitle>
  </CardHeader>

  <CardContent>
  <div style={{ width: '100%', height: 400 }}>
  <ResponsiveContainer width="100%" height="100%">
  <AreaChart data={riskTrend}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="LOW" stackId="1" stroke="#10b981" fill="#10b981" />
      <Area type="monotone" dataKey="MID" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
      <Area type="monotone" dataKey="HIGH" stackId="1" stroke="#ef4444" fill="#ef4444" />
    </AreaChart>
  </ResponsiveContainer>
</div>

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
                  {users.map((u) => (
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
              <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>이전</Button>
<span>{currentPage} / {totalPages}</span>
<Button size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>다음</Button>

              </div>
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
