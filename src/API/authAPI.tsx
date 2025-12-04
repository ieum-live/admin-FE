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

// 로그인
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

        await axios.post("/auth/logout", {
            accessToken,
            refreshToken,
        });

        clearTokens();
        console.log("🚪 로그아웃 완료");
    } catch (err) {
        console.error("❌ 로그아웃 실패:", err);
        throw err;
    }
};
