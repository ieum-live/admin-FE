// src/API/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 1. Axios 인스턴스 생성
const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
    timeout: 5000, // 타임아웃 설정 (선택사항)
});

// 2. 요청 인터셉터 (토큰 실어 보내기)
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // ⚠️ 여기서 async_hooks나 서버 전용 로직을 쓰면 안 됩니다.
        // 브라우저용 localStorage만 사용하세요.
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. 응답 인터셉터 (토큰 만료 처리)
instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // 401 에러(인증 실패)이고, 아직 재시도하지 않았다면
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // 토큰 재발급 요청
                // 주의: 여기서도 순수 axios나 fetch를 써야 순환 참조를 막을 수 있습니다.
                const res = await axios.post(`${apiUrl}/auth/refresh`, {
                    refreshToken: refreshToken,
                });

                const newAccessToken = res.data.data.accessToken;

                // 새 토큰 저장
                localStorage.setItem("accessToken", newAccessToken);

                // 헤더 업데이트 후 재요청
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return instance(originalRequest);
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);

                // 로그아웃 처리
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                // 로그인 페이지로 이동
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
