import instance from "./axios";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface UpdateAdminRequest {
    name?: string;
    password?: string;
  }
  

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

export const getAdminStudentsAPI = async (adminId: string) => {
    const res = await instance.get(`/api/admin-management/admins/${adminId}/students`);
    console.log("그룹 API", res.data)
    return res.data.data;
  };

  export const assignStudentsAPI = async (adminId: string, studentIds: string[]) => {
    const res = await instance.post(
      `/api/admin-management/admins/${adminId}/assign-students`,
      { studentIds }
    );
    return res.data;
  };
  
  
  export const unassignStudentsAPI = async (adminId: string, studentIds: string[]) => {
    const res = await instance.post(`/api/admin-management/admins/${adminId}/unassign-students`, { studentIds });
    return res.data;
  };

  export const updateAdminRoleAPI = async (adminId: string, role: AdminRole) => {
    const res = await instance.put(`/api/admin-management/admins/${adminId}`, {
      role,
    });
  
    return res.data;
  };

  export const updateAdminAPI = async (adminId: string, body: UpdateAdminRequest) => {
    const payload: UpdateAdminRequest = {};
    if (body.name) payload.name = body.name;
    if (body.password) payload.password = body.password;
  
    const res = await instance.put(`/api/admin-management/admins/${adminId}`, payload);
    return res.data;
  };
  