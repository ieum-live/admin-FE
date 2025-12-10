import instance from "./axios";

export const getSettings = async () => {
    const response = await instance.get(`/api/settings`);
    return response.data.data;
}

export interface ContactInfo {
    orgName: string;
    email: string;
    phone: string;
}

export interface SettingsData {
    sessionTimeoutMinutes: number;
    retentionDays: number;
    contact: ContactInfo;
}

export const updateSettings = async (settings: SettingsData) => {
    const response = await instance.put(`/api/settings`, settings);
    return response.data;
};
