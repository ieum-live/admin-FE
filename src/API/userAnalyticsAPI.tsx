import instance from "./axios";

export type DiagnosticsTrendItem = {
  weekStartDate: string; // YYYY-MM-DD
  weekLabel: string;     // ex) "9/2주"
  phq9Avg: number;
  gad7Avg: number;
  cagiAvg: number;
  totalUsers: number;
};

export type PeriodType = "WEEK_2" | "MONTH_3";

interface DiagnosticsTrendResponse {
  data: DiagnosticsTrendItem[];
}

export interface DiagnosticsTrendParams {
  period: PeriodType;
  filterByAdminId?: string;
}

export async function getDiagnosticsTrend(
  params: DiagnosticsTrendParams
): Promise<DiagnosticsTrendItem[]> {
  try {
    const res = await instance.get<DiagnosticsTrendResponse>(
      "/api/metrics/diagnostics/trend",
      {
        params,
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("❌ 진단 추세 API 호출 실패:", error);
    throw error;
  }
}
