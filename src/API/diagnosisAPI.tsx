import instance from "./axios";

// ================================
// 📌 공통: 날짜 문자열 변환 함수
// ================================
const formatDate = (date: Date) => date.toISOString().slice(0, 10);

// ================================
// 📌 최근 설문 사용자 리스트 API
// ================================
export const getRecentUsers = async () => {
  try {
    const res = await instance.get(`/api/diagnostics/recent`, {
      params: { days: 7 },
    });

    if (!res.data || !res.data.data) {
      console.warn("📌 최근 사용자 조회: 빈 배열 반환");
      return [];
    }

    return Array.isArray(res.data.data) ? res.data.data : [];
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
   