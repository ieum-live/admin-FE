import instance from "./axios";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface Admin {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    assignedStudentCount: number;
    createdAt: string;
  }

export interface AddAdminRequest {
  email: string;
  role: AdminRole;
}

export const addAdminAPI = async (body: AddAdminRequest) => {
  const res = await instance.post("/api/admin-management/admins", body);
  return res.data;
};

export const deleteAdminAPI = async (adminId: string) => {
    const res = await instance.delete(
      `/api/admin-management/admins/${adminId}`
    );
    return res.data;
  };

export const getAdminAPI = async (adminId: string) => {
const res = await instance.get(
    `/api/admin-management/admins/${adminId}`
);
return res.data;
};

export const getAdminsAPI = async (): Promise<Admin[]> => {
  const res = await instance.get("/api/admin-management/admins");
  return res.data.data;
};