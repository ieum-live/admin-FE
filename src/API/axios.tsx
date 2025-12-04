import axios from "axios";
import { refreshAccessToken } from "./common";

const apiUrl = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
    baseURL: apiUrl,
});


export const customAxios = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});


customAxios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});


customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await axios.post(`${apiUrl}/auth/refresh`, {
                    refreshToken: refreshToken,
                });

                const newAccessToken = res.data.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return customAxios(originalRequest);
            } catch (refreshError) {
                console.error("❌ 토큰 재발급 실패:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

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
