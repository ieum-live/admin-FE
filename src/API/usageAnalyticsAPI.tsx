import instance from "./axios";

/* =======================
   TOP5 기능
======================= */

export type TopFeatureItem = {
  feature: string;
  avgDurationSec: number;
  totalSessions: number;
};

interface TopFeatureResponse {
  data: TopFeatureItem[];
}

export async function getTop5Features(
  from: string,
  to: string
): Promise<TopFeatureItem[]> {
  const res = await instance.get<TopFeatureResponse>(
    "/api/usage/features/top5",
    {
      params: { from, to },
    }
  );

  return res.data.data;
}

/* =======================
   기능별 사용 추세 (시계열)
======================= */

export interface ApiResponse<T> {
    error: boolean;
    message: string;
    code: number;
    data: T;
  }
  

export type FeatureTrendItem = {
  date: string;   // YYYY-MM-DD
  count: number;
};


export interface FeatureTrendPayload {
    feature: string;
    data: FeatureTrendItem[];
  }
  
  
  // usageAnalyticsAPI.ts

// usageAnalyticsAPI.ts

export async function getFeatureUsageTrend(
    feature: string,
    period: string
  ): Promise<FeatureTrendPayload> {
    const res = await instance.get(
      "/api/usage/features",
      {
        params: { feature, period },
        timeout: 150000, // 🔥 트렌드 전용
      }
    );
  
    return res.data.data;
  }
  
  
  
  
  
