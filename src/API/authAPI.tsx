import axios from "./axios";
import ApiResponseDTO, { RefreshAccessTokenResponse } from "./common";

const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};


export const signIn = async (email: string, password: string) => {
    try {
        const res = await axios.post<ApiResponseDTO<RefreshAccessTokenResponse>>(
            "/auth/login",
            { email, password }
        );

        const { accessToken, refreshToken } = res.data.data;
        setTokens(accessToken, refreshToken);

        console.log("🔐 로그인 완료");
        return res.data.data;
    } catch (err) {
        console.error("❌ 로그인 실패:", err);
        throw err;
    }
};

// 로그아웃
export const signOut = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
            return;
        }

        await axios.post("/auth/logout", {
            accessToken,
            refreshToken,
        });

        console.log("🚪 서버 로그아웃 성공");

    } catch (err) {
        console.error("⚠️ 서버 로그아웃 요청 실패 (클라이언트 강제 로그아웃 진행):", err);
    } finally {

        clearTokens();
        window.location.href = "/login";
    }
};