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

        return res.data.data;
    } catch (err) {
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
    } catch (err) {
        // 로그아웃 실패해도 클라이언트에서 토큰 삭제 진행
    } finally {
        clearTokens();
        window.location.href = "/login";
    }
};