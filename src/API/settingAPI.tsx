import { customAxios } from "./axios";

export const getSettings = async () => {
    const response = await customAxios.get(`/api/settings`);
    return response.data.data;
}

export const updateSettings = async (settings: Record<string, any>) => {
    const response = await customAxios.put(`/api/settings`, settings);
    return response.data;
}