import instance from "./axios";

export interface RiskDistributionItem {
    label: string; // 날짜 / 주차 / 월
    LOW: number;
    MID: number;
    HIGH: number;
  }
  
  export interface RiskDistributionResponse {
    data: RiskDistributionItem[];
  }

  
  // ================================
// 📌 위험도별 사용자 분포 추이 API
// ================================
export const getRiskDistributionTrend = async (
    type?: "PHQ-9" | "GAD-7" | "CAGI",
    period: "2weeks" | "1month" | "3months" | "6months" = "1month"
  ): Promise<RiskDistributionItem[]> => {
    try {
      const res = await instance.get(
        "/api/diagnostics/risk-distribution-trend",
        {
          params: {
            type: type,
            period,
          },
        }
      );
      return res.data?.data ?? [];
    } catch (err) {
      console.error("❌ 위험도 분포 추이 조회 실패", err);
      throw err;
    }
  };
  
  
  export interface RecentUsersResponse {
    content: UserDataAPI[];
    page: {
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
    };
  }
  
  export interface UserDataAPI {
    email: string;
    name: string;
    lastDiagnosisDate: string;
    testName: string;
    score: number;
    scaleName: string;
  }
  
  export const getRecentUsers = async (params?: {
    type?: "PHQ-9" | "GAD-7" | "CAGI";
    period?: "2weeks" | "1month" | "3months" | "6months";
    page?: number;
    size?: number;
  }): Promise<RecentUsersResponse> => {
    try {
      const res = await instance.get(`/api/diagnostics/results/list`, { params });
      return res.data.data;
    } catch (err) {
      console.error("❌ 최근 사용자 조회 실패", err);
      throw err;
    }
  };
  

// ================================
// 📌 CSV 다운로드 API
// ================================
export const exportDiagnosisCSV = async (from: string, to: string) => {
    try {
      const res = await instance.get(`/api/export/diagnostics.csv`, {
        params: { from, to },
        responseType: "blob",
        headers: {
          Accept: "text/csv",
        },
      });
  
      return res.data;
    } catch (err) {
      console.error("❌ CSV 다운로드 실패:", err);
      throw err;
    }
  };
   