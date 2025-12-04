import axios from "./axios";

export default interface ApiResponseDTO<T> {
    error: boolean;
    message: string;
    code: number;
    data: T;
}

export interface RefreshAccessTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("🚪 토큰 삭제 완료");
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        console.error("❗ refreshToken 없음");
        return;
    }

    try {
        const res = await axios.post("/auth/refresh", { refreshToken });

        const { accessToken: newAT, refreshToken: newRT } = res.data.data;

        localStorage.setItem("accessToken", newAT);
        localStorage.setItem("refreshToken", newRT);

        console.log("🔄 토큰 재발급 완료");
        return newAT;
    } catch (err) {
        console.error("❌ 토큰 재발급 실패:", err);
        logout();
        return;
    }
};
