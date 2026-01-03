import instance from "./axios";

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export interface DiagnosisSummaryParams {
  filterByAdminId?: string;
}

export const getDiagnosisSummary = async (
  params?: DiagnosisSummaryParams
) => {
  try {
    const today = new Date();
    const to = formatDate(today);

    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const from = formatDate(threeMonthsAgo);

    const res = await instance.get("/api/diagnostics/summary", {
      params: {
        from,
        to,
        ...params, // ⭐ 여기 핵심
      },
    });

    if (!res.data || !res.data.data) {
      console.warn("📌 진단 요약 API: 데이터 없음");
      return {};
    }

    return res.data.data;
  } catch (err) {
    console.error("❌ 진단 요약 요청 실패", err);
    throw err;
  }
};

export const getMetricsOverview = async () => {
  try {
    const res = await instance.get(`/api/metrics/overview`, {
      timeout: 30000, // ✅ 30초로 증가
    });

    if (!res.data || !res.data.data) {
      console.warn("📌 Metrics Overview API: 데이터 없음");
      return null;
    }

    return res.data.data;
  } catch (err) {
    console.error("❌ Metrics Overview 요청 실패", err);
    throw err;
  }
};

export type RankingPeriod = "all_time" | "weekly";

export const getUserRanking = async (
  period: RankingPeriod = "all_time",
  limit: number = 5
) => {
  const response = await instance.get("/api/ranking", {
    params: { period, limit },
  });
  return response.data.data;
};
