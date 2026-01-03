import instance from "./axios";

export interface RiskDistributionItem {
  label: string;
  LOW: number;
  MID: number;
  HIGH: number;
}

export const getRiskDistributionTrend = async (
  type?: "PHQ-9" | "GAD-7" | "CAGI",
  period: "2weeks" | "1month" | "3months" | "6months" = "1month",
  filterByAdminId?: string
): Promise<RiskDistributionItem[]> => {
  try {
    const res = await instance.get(
      "/api/diagnostics/risk-distribution-trend",
      {
        params: {
          type,
          period,
          ...(filterByAdminId ? { filterByAdminId } : {}),
        },
      }
    );

    return res.data?.data ?? [];
  } catch (err) {
    console.error("❌ 위험도 분포 추이 조회 실패", err);
    throw err;
  }
};


export interface UserDataAPI {
  email: string;
  name: string;
  lastDiagnosisDate: string;
  testName: string;
  score: number;
  scaleName: string;
}

export interface RecentUsersResponse {
  content: UserDataAPI[];
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const getRecentUsers = async (params?: {
  type?: "PHQ-9" | "GAD-7" | "CAGI";
  period?: "2weeks" | "1month" | "3months" | "6months";
  page?: number;
  size?: number;
  filterByAdminId?: string;
}): Promise<RecentUsersResponse> => {
  try {
    const res = await instance.get(
      "/api/diagnostics/results/list",
      { params }
    );
    return res.data.data;
  } catch (err) {
    console.error("❌ 최근 사용자 조회 실패", err);
    throw err;
  }
};


export const exportDiagnosisCSV = async (
  type?: "PHQ-9" | "GAD-7" | "CAGI",
  period: "2weeks" | "1month" | "3months" | "6months" = "1month",
  filterByAdminId?: string
): Promise<Blob> => {
  try {
    const res = await instance.get(
      "/api/diagnostics/results/list/csv",
      {
        params: {
          type,
          period,
          ...(filterByAdminId ? { filterByAdminId } : {}),
        },
        responseType: "blob",
        headers: {
          Accept: "text/csv",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ CSV 다운로드 실패", err);
    throw err;
  }
};
