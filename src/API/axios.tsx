import axios from "axios";
import { refreshAccessToken } from "./common";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// 요청 인터셉터 → 토큰 자동 첨부
instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 응답 인터셉터 → 401 → 토큰 자동 재발급
instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        // 토큰 만료 케이스
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const newToken = await refreshAccessToken();
            if (newToken) {
                original.headers.Authorization = `Bearer ${newToken}`;
                return instance(original);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
