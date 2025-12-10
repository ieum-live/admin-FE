import instance from "./axios";

export type AlertType = "GENERAL" | "ASSESSMENT" | "ACHIEVEMENT" | "SYSTEM" | "URGENT";

interface AlertPayload {
    title: string;
    message: string;
    type?: AlertType
}


export interface BatchAlertPayload {
    userIds: string[];
    title: string;
    message: string;
    type?: AlertType;
}
export const sendUserAlert = async (userId: string, payload: AlertPayload) => {
    try {
        const response = await instance.post(`/api/alerts/users/${userId}`, payload);
        return response.data;
    } catch (error: any) {
        console.error("개별 알림 발송 실패:", error);
        throw new Error(error?.response?.data?.message || "알림 발송 중 오류가 발생했습니다.");
    }
};

export const sendBulkAlert = async (payload: BatchAlertPayload) => {
    try {
        const response = await instance.post(`/api/alerts/batch-send`, payload);
        return response.data;
    } catch (error: any) {
        console.error("일괄 알림 발송 실패:", error);
        throw new Error(error?.response?.data?.message || "일괄 알림 발송 중 오류가 발생했습니다.");
    }
}