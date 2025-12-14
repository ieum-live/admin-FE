import instance from "./axios";

export type DiagnosticsTrendItem = {
  weekStartDate: string; // YYYY-MM-DD
  weekLabel: string;     // ex) "9/2주"
  phq9Avg: number;
  gad7Avg: number;
  cpgiAvg: number;
  totalUsers: number;
};

export type PeriodType = "WEEK_2" | "MONTH_3";

interface DiagnosticsTrendResponse {
  data: DiagnosticsTrendItem[];
}

export async function getDiagnosticsTrend(
  period: PeriodType
): Promise<DiagnosticsTrendItem[]> {
  try {
    const res = await instance.get<DiagnosticsTrendResponse>(
      "/api/metrics/diagnostics/trend",
      {
        params: { period },
      }
    );

    // axios는 res.data가 실제 body
    return res.data.data;
  } catch (error) {
    console.error("❌ 진단 추세 API 호출 실패:", error);
    throw error;
  }
}
