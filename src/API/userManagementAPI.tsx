import { TIMEOUT } from "dns";
import instance from "./axios";

export interface GetUsersParams {
    query?: string;
    risk?: "LOW" | "MID" | "HIGH";
    status?: string;
    page?: number;
    size?: number;
    filterByAdminId?: string;
}
export type AssessmentType = "Simple" | "PHQ-9" | "GAD-7" | "BDI";

export const getUsers = async ({
    query,
    risk,
    status,
    page,
    size,
    filterByAdminId,
}: GetUsersParams) => {
    const response = await instance.get(`/api/users`, {
        params: {
            query,
            risk,
            status,
            page,
            size,
            ...(filterByAdminId && { filterByAdminId }),
        },
        timeout: 15000
    });
    console.log(response.data.data)
    return response.data.data;
};

export const getUserStatistics = async (
    filterByAdminId?: string
  ) => {
    const response = await instance.get(`/api/users/statistics`, {
      params: filterByAdminId
        ? { filterByAdminId }
        : {},
    });
  
    return response.data.data;
  };
  

export const getUser = async (userId: string) => {
    const response = await instance.get(`/api/users/${userId}`, {});
    return response.data.data;
};

export const getUserDetail = async (userId: string) => {
    const response = await instance.get(`/api/users/${userId}/detail`, {});
    return response.data.data;
};

export const getUserAssessments = async (
    userId: string,
    type?: AssessmentType
) => {
    const response = await instance.get(`/api/users/${userId}/assessments`, {
        params: { type },
    });
    return response.data.data;
};
