import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Search,
  ShieldPlus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { updateAdminRoleAPI , assignStudentsAPI, unassignStudentsAPI, getAdminStudentsAPI, getAdminsAPI, addAdminAPI, deleteAdminAPI, AdminRole } from "../API/groupManagementAPI";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getUsers } from "../API/userManagementAPI";
import LoadingSpinner from "./LoadingSpinner";
import { GroupManagementJoyride } from "./Joyride/GroupManagementJoyride"

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface Student {
  assignedAdmins: any;
  id: string;
  name: string;
  email: string;
}

interface ConfirmModalProps {
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const initialAssignments: Record<string, string[]> = {
  a1: ["u1"],
  a2: ["u2"],
  a3: [],
};

export const forceLogout = (message?: string) => {
  if (message) {
    alert(message);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("me");

  window.location.href = "/login";
};

export function ConfirmModal({ title, children, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[360px]">
        <CardHeader className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <button onClick={onClose}>
            <X />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>{children}</div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>취소</Button>
            <Button variant="destructive" onClick={onConfirm}>확인</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GroupManagement() {

  const me = JSON.parse(localStorage.getItem("me") || "null");

  const currentAdminId = me?.id;
  const myRole = me?.role;
  const isSuperAdmin = me?.role === "SUPER_ADMIN";
  
  useEffect(() => {
    if (!me) {
      forceLogout("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
  }, []);

  const [admins, setAdmins] = useState<Admin[]>([]);

const fetchAdmins = async () => {
  try {
    const data = await getAdminsAPI();
    setAdmins(data);
  } catch (e) {
    console.error("관리자 목록 조회 실패", e);
  }
};

useEffect(() => {
  fetchAdmins();
}, []);
  const [assignments, setAssignments] = useState(initialAssignments);


  /* ================= 상태 ================= */
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [checkedStudents, setCheckedStudents] = useState<string[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const [adminSearch, setAdminSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  /* ===== 모달 ===== */
  const [addModal, setAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<
    null | { type: "delete" | "role"; target?: Admin }
  >(null);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");


  const addAdmin = async () => {
    if (!newAdminEmail) return;
  
    try {
      await addAdminAPI({
        email: newAdminEmail,
        role: newAdminRole,
      });

      await fetchAdmins();
  
      setAddModal(false);
      setNewAdminEmail("");
      setNewAdminRole("ADMIN");
  
    } catch (e) {
      console.error("관리자 추가 실패", e);
    }
  };


  useEffect(() => {
    if (!currentAdminId) return;
  
    setSelectedAdminId(currentAdminId);
    setCheckedStudents(assignments[currentAdminId] ?? []);
  }, [currentAdminId]);
  

  const selectedAdmin = admins.find(a => a.id === selectedAdminId);

  const filteredAdmins = useMemo(() => {
    if (!me) return [];
  
    const base = isSuperAdmin
      ? admins
      : admins.filter(a => a.id === me.id);
  
    return base
      .filter(
        a =>
          a.name.includes(adminSearch) ||
          a.email.includes(adminSearch)
      )
      .sort((a, b) => {
        if (a.role === "SUPER_ADMIN" && b.role !== "SUPER_ADMIN") return -1;
        if (b.role === "SUPER_ADMIN" && a.role !== "SUPER_ADMIN") return 1;
  
        if (a.id === currentAdminId) return -1;
        if (b.id === currentAdminId) return 1;
  
        return 0;
      });
  }, [admins, adminSearch, isSuperAdmin, me, currentAdminId]);  
  
  const toggleStudent = (id: string) => {
    setCheckedStudents(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  };

  const changeRole = async (admin: Admin) => {
    const newRole: AdminRole = admin.role === "ADMIN" ? "SUPER_ADMIN" : "ADMIN";
  
    try {
      await updateAdminRoleAPI(admin.id, newRole);
  
      setAdmins(prev =>
        prev.map(a =>
          a.id === admin.id ? { ...a, role: newRole } : a
        )
      );
  
      setConfirmModal(null);
      alert(`${admin.name}의 권한이 ${newRole === "SUPER_ADMIN" ? "슈퍼 관리자" : "관리자"}로 변경되었습니다.`);
  
    } catch (e) {
      console.error(e);
      alert("권한 변경에 실패했습니다.");
    }
  };

  const deleteAdmins = async () => {
    try {
      const targetAdminIds = selectedAdmins.filter(
        (id) => id !== currentAdminId
      );
  
      if (targetAdminIds.length === 0) {
        setConfirmModal(null);
        setSelectedAdmins([]);
        return;
      }
  
      await Promise.all(
        targetAdminIds.map((adminId) => deleteAdminAPI(adminId))
      );

      await fetchAdmins();
  
      setAdmins((prev) =>
        prev.filter(
          (admin) => !targetAdminIds.includes(admin.id)
        )
      );
  
      setSelectedAdmins([]);
      setConfirmModal(null);
    } catch (e) {
      console.error("관리자 삭제 실패", e);
    }
  };


const [allStudents, setAllStudents] = useState<Student[]>([]);
const [assignedStudents, setAssignedStudents] = useState<string[]>([]); // 현재 선택된 adminId의 학생 id 배열

const fetchStudents = async (adminId: string) => {
  setLoadingStudents(true);
  try {
    const res = await getUsers({ page: 0, size: 10000 });
    const students = res.content;

    const assignedRes = await getAdminStudentsAPI(adminId);
  console.log("그룹", assignedRes);

  const assignedIds = assignedRes.flat().map((s: any) => s.id);
  setAssignedStudents(assignedIds);
  setCheckedStudents(assignedIds);

    setAllStudents(students);
    setAssignedStudents(assignedIds);
    setCheckedStudents(assignedIds);
  } catch (e) {
    console.error("학생 조회 실패", e);
  } finally {
    setLoadingStudents(false);
  }
};


const sortedStudents = useMemo(() => {
  return allStudents
    .slice()
    .sort((a, b) => {
      const aCurrent = assignedStudents.includes(a.id);
      const bCurrent = assignedStudents.includes(b.id);

      if (aCurrent && !bCurrent) return -1; // 현재 관리자 학생 먼저
      if (!aCurrent && bCurrent) return 1;

      const aOther = a.assignedAdmins.length > 0;
      const bOther = b.assignedAdmins.length > 0;

      if (!aCurrent && aOther && !bOther) return 1; // 다른 관리자 배정 학생 뒤로
      if (!bCurrent && !aOther && bOther) return -1;

      return 0; // 나머지 순서는 그대로
    });
}, [allStudents, assignedStudents]);

const itemsPerPage = 5; // 한 페이지당 학생 수
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loadingStudents, setLoadingStudents] = useState(false);

const filteredStudents = useMemo(() => {
  return sortedStudents
    .filter(s =>
      s.name.includes(studentSearch) ||
      s.email.includes(studentSearch)
    );
}, [sortedStudents, studentSearch]);

const paginatedStudents = useMemo(() => {
  const total = filteredStudents.length;
  setTotalPages(Math.ceil(total / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  return filteredStudents.slice(start, start + itemsPerPage);
}, [filteredStudents, currentPage]);


useEffect(() => {
  if (selectedAdminId) {
    fetchStudents(selectedAdminId);
  }
}, [selectedAdminId]);

const adminsPerPage = 5;
const [adminCurrentPage, setAdminCurrentPage] = useState(1);
const [adminTotalPages, setAdminTotalPages] = useState(1);


useEffect(() => {
  setAdminTotalPages(Math.ceil(filteredAdmins.length / adminsPerPage));
}, [filteredAdmins]);

const filteredAdminsPaginated = useMemo(() => {
  const start = (adminCurrentPage - 1) * adminsPerPage;
  return filteredAdmins.slice(start, start + adminsPerPage);
}, [filteredAdmins, adminCurrentPage]);

useEffect(() => {
  setCurrentPage(1); 
}, [studentSearch]);

useEffect(() => {
  setAdminCurrentPage(1); 
}, [adminSearch]);

const [originalCheckedStudents, setOriginalCheckedStudents] = useState<string[]>([]);

const handleSelectAdmin = (adminId: string) => {
  if (!isSuperAdmin && adminId !== currentAdminId) return;

  const hasUnsavedChanges =
    JSON.stringify(checkedStudents) !== JSON.stringify(assignedStudents);

  if (hasUnsavedChanges) {
    const confirmLeave = window.confirm(
      "저장하지 않은 변경 사항이 있습니다. 그래도 이동하시겠습니까?"
    );
    if (!confirmLeave) return;
  }

  setSelectedAdminId(adminId);
  setCheckedStudents(assignedStudents);
  setOriginalCheckedStudents(assignedStudents);
  fetchStudents(adminId);
  setCurrentPage(1);
};


const [saving, setSaving] = useState(false);

const saveAssignment = async () => {
  if (!selectedAdminId) return;

  const prevAssigned = assignedStudents;
  const nowChecked = checkedStudents;

  const toAssign = nowChecked.filter(id => !prevAssigned.includes(id));
  const toUnassign = prevAssigned.filter(id => !nowChecked.includes(id));

  setSaving(true);
  try {
    if (toAssign.length) {
      await assignStudentsAPI(selectedAdminId, toAssign);
    }
    if (toUnassign.length) {
      await unassignStudentsAPI(selectedAdminId, toUnassign);
    }

    alert("담당 학생이 저장되었습니다.");

    await fetchStudents(selectedAdminId);
    setCurrentPage(1);
  } catch (e) {
    console.error("학생 배정/해제 실패", e);
    alert("학생 배정에 실패했습니다.");
  } finally {
    setSaving(false);
  }
};


return (
  <>
    <div className="grid grid-cols-[360px,1fr] gap-6">
      {/* ================= 관리자 목록 ================= */}
      <Card className="joyride-admin-list">
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-center">
            <CardTitle>관리자 목록</CardTitle>
            {isSuperAdmin && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setAddModal(true)} className="joyride-admin-add">
                  <ShieldPlus className="h-4 w-4 mr-1" /> 관리자 추가
                </Button>
                <Button
                  size="sm"
                  className="joyride-admin-delete"
                  variant="destructive"
                  disabled={!selectedAdmins.length}
                  onClick={() => setConfirmModal({ type: "delete" })}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> 삭제
                </Button>
              </div>
            )}
          </div>
          <div className="mb-2 joyride-admin-search">
          <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-2">
            <Search className="w-4 h-4" /> 관리자 검색
          </label>
          <Input
            placeholder="이름, 이메일"
           value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            className="text-sm placeholder:text-sm"
          />
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {filteredAdminsPaginated.map((admin) => {
            const isMe = admin.id === currentAdminId;
            return (
              <div
                key={admin.id}
                onClick={() => handleSelectAdmin(admin.id)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedAdminId === admin.id ? "bg-muted border-primary" : "hover:bg-muted"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">{admin.name}</span>
                      {isMe && <Badge>내 그룹</Badge>}
                      <Badge variant={admin.role === "SUPER_ADMIN" ? "destructive" : "secondary"}>
                        {admin.role === "SUPER_ADMIN" ? "슈퍼 관리자" : "관리자"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{admin.email}</div>
                  </div>
                  {isSuperAdmin && !isMe && (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin.id)}
                        onChange={() =>
                          setSelectedAdmins((prev) =>
                            prev.includes(admin.id)
                              ? prev.filter((v) => v !== admin.id)
                              : [...prev, admin.id]
                          )
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="joyride-admin-change-role"
                        onClick={() => setConfirmModal({ type: "role", target: admin })}
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex justify-between mt-4">
            <Button onClick={() => setAdminCurrentPage((p) => Math.max(1, p - 1))} disabled={adminCurrentPage === 1}>
              이전
            </Button>
            <span className="text-sm">
              {adminCurrentPage} / {adminTotalPages}
            </span>
            <Button
              onClick={() => setAdminCurrentPage((p) => Math.min(adminTotalPages, p + 1))}
              disabled={adminCurrentPage === adminTotalPages}
            >
              다음
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= 학생 관리 ================= */}
      <Card className="joyride-student-list">
        <CardHeader>
          <CardTitle>{selectedAdmin ? `${selectedAdmin.name} 담당 학생` : "담당 학생"}</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="mb-2 joyride-group-student-search">
          <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-2">
            <Search className="w-4 h-4" /> 학생 검색
          </label>
          <Input
            placeholder="이름, 이메일"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="text-sm placeholder:text-sm"
          />
          </div>

          {loadingStudents || saving ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-2">
              {paginatedStudents.map((student) => (
                <label key={student.id} className="flex gap-2 p-2 hover:bg-muted rounded">
                  <input
                    type="checkbox"
                    checked={checkedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                  />
                  <div>
                    <div className="text-sm font-medium">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.email}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              이전
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              다음
            </Button>
          </div>

          <Button className="w-full mt-4 joyride-student-save" onClick={saveAssignment} disabled={!selectedAdminId}>
            담당 학생 저장
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* ================= 모달 ================= */}
    {addModal && (
      <ConfirmModal
        title="관리자 추가"
        onClose={() => setAddModal(false)}
        onConfirm={addAdmin}
      >
        <Input
          placeholder="관리자 이메일"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
        />

        <Select value={newAdminRole} onValueChange={(v) => setNewAdminRole(v as "ADMIN" | "SUPER_ADMIN")}>
          <SelectTrigger className="mt-3">
            <SelectValue placeholder="관리자 역할 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">일반 관리자</SelectItem>
            <SelectItem value="SUPER_ADMIN">슈퍼 관리자</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground mt-3 space-y-1"> 
          <p>• 이름: 이메일 주소의 @ 앞부분으로 자동 설정</p>
          <p> • 기본 비밀번호: <b>ieum1234!</b> </p>
          <p>• 최초 로그인 후 이름/비밀번호 변경 권장</p> </div>
      </ConfirmModal>
    )}

    {confirmModal && (
      <ConfirmModal
        title={confirmModal.type === "delete" ? "관리자 삭제" : "권한 변경"}
        onClose={() => setConfirmModal(null)}
        onConfirm={() =>
          confirmModal.type === "delete" ? deleteAdmins() : confirmModal.target && changeRole(confirmModal.target)
        }
      >
        정말 진행하시겠습니까?
      </ConfirmModal>
    )}

    <GroupManagementJoyride />
  </>
);
}