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
