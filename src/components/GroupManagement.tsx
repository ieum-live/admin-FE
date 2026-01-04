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
import { Search, ShieldPlus, ShieldCheck, Trash2, X } from "lucide-react";
import {
  getAdminAPI,
  updateAdminRoleAPI,
  assignStudentsAPI,
  unassignStudentsAPI,
  getAdminStudentsAPI,
  getAdminsAPI,
  addAdminAPI,
  deleteAdminAPI,
  AdminRole,
} from "../API/groupManagementAPI";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getUsers } from "../API/userManagementAPI";
import LoadingSpinner from "./LoadingSpinner";
import { GroupManagementJoyride } from "./Joyride/GroupManagementJoyride";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface Student {
  assignedAdmins: any[];
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
  const myAdminId = localStorage.getItem("adminId"); // 로그인 시 저장된 adminId
  const [myRole, setMyRole] = useState<"SUPER_ADMIN" | "ADMIN">("ADMIN"); 
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<string[]>([]);
  const [checkedStudents, setCheckedStudents] = useState<string[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(myAdminId);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const [adminSearch, setAdminSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<null | { type: "delete" | "role"; target?: Admin }>(null);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= 내 역할 조회 ================= */
  useEffect(() => {
    if (!myAdminId) return;

    const fetchMyRole = async () => {
      try {
        const data = await getAdminAPI(myAdminId);
        setMyRole(data.data.role);
      } catch (err) {
        console.error("내 역할 조회 실패", err);
      }
    };

    fetchMyRole();
  }, [myAdminId]);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const data = await getAdminsAPI();
      setAdmins(data);
    } catch (e) {
      console.error("관리자 목록 조회 실패", e);
    }finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const selectedAdmin = admins.find(a => a.id === selectedAdminId);

    const filteredAdmins = useMemo(() => {
      if (!myAdminId) return [];
      const base = myRole === "SUPER_ADMIN" ? admins : admins.filter(a => a.id === myAdminId);
      const filtered = base.filter(a => a.name.includes(adminSearch) || a.email.includes(adminSearch));
    
      // 정렬: 자기 자신 > SUPER_ADMIN > ADMIN
      filtered.sort((a, b) => {
        if (a.id === myAdminId) return -1;
        if (b.id === myAdminId) return 1;
        if (a.role === "SUPER_ADMIN" && b.role !== "SUPER_ADMIN") return -1;
        if (b.role === "SUPER_ADMIN" && a.role !== "SUPER_ADMIN") return 1;
        return 0;
      });
    
      return filtered;
    }, [admins, adminSearch, myRole, myAdminId]);
    
    const fetchStudents = async (adminId: string) => {
      setLoadingStudents(true);
      try {
        // 전체 학생 조회
        const res = await getUsers({ page: 0, size: 10000 });
        const allUsers = Array.isArray(res.content) ? res.content : [];
        setAllStudents(allUsers);
    
        // 담당 학생 조회
        const assignedRes = await getUsers({ filterByAdminId: adminId, page: 0, size: 10000 });
        const assignedIds = Array.isArray(assignedRes.content) ? assignedRes.content.map(s => s.id) : [];
    
        setAssignedStudents(assignedIds);
        setCheckedStudents(assignedIds);
      } catch (e) {
        console.error("학생 조회 실패", e);
        setAllStudents([]);
        setAssignedStudents([]);
        setCheckedStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

  useEffect(() => {
    if (selectedAdminId) {
      fetchStudents(selectedAdminId);
    }
  }, [selectedAdminId]);

  const toggleStudent = (id: string) => {
    setCheckedStudents(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const saveAssignment = async () => {
    if (!selectedAdminId) return;
    const toAssign = checkedStudents.filter(id => !assignedStudents.includes(id));
    const toUnassign = assignedStudents.filter(id => !checkedStudents.includes(id));

    setSaving(true);
    try {
      if (toAssign.length) await assignStudentsAPI(selectedAdminId, toAssign);
      if (toUnassign.length) await unassignStudentsAPI(selectedAdminId, toUnassign);

      alert("담당 학생이 저장되었습니다.");
      await fetchStudents(selectedAdminId);
    } catch (e) {
      console.error("학생 배정/해제 실패", e);
      alert("학생 배정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

const [isEmailValid, setIsEmailValid] = useState(true);


const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const email = e.target.value;
  setNewAdminEmail(email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setIsEmailValid(emailRegex.test(email));
};

const addAdmin = async () => {
  if (!newAdminEmail) {
    alert("이메일을 입력해주세요.");
    return;
  }

  if (!isEmailValid) {
    alert("유효한 이메일 주소를 입력해주세요.");
    return;
  }

  try {
    await addAdminAPI({ email: newAdminEmail, role: newAdminRole });
    await fetchAdmins();
    setAddModal(false);
    setNewAdminEmail("");
    setNewAdminRole("ADMIN");
  } catch (e: any) {
    console.error("관리자 추가 실패", e);

    // Axios 에러일 경우
    if (e.response) {
      const status = e.response.status;
      const data = e.response.data;

      if (status === 500) {
        alert("이미 존재하는 이메일입니다.");
      } else {
        alert("관리자 추가에 실패했습니다.");
      }
    } else {
      alert("관리자 추가에 실패했습니다.");
    }
  }
};

  const changeRole = async (admin: Admin) => {
    const newRole: AdminRole = admin.role === "ADMIN" ? "SUPER_ADMIN" : "ADMIN";
    try {
      await updateAdminRoleAPI(admin.id, newRole);
      setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, role: newRole } : a));
      setConfirmModal(null);
      alert(`${admin.name} 권한이 변경되었습니다.`);
    } catch (e) {
      console.error(e);
      alert("권한 변경에 실패했습니다.");
    }
  };

  const deleteAdmin = async (admin: Admin) => {
    try {
      await deleteAdminAPI(admin.id); 
      await fetchAdmins(); 
      setConfirmModal(null); // 모달 닫기
      alert(`${admin.name} 관리자가 삭제되었습니다.`);
    } catch (e) {
      console.error("관리자 삭제 실패", e);
      alert("관리자 삭제에 실패했습니다.");
    }
  };
  
  const handleSelectAdmin = (adminId: string) => {
    if (myRole != "SUPER_ADMIN" && adminId !== myAdminId) return;
    setSelectedAdminId(adminId);
    setCurrentPage(1); // 관리자 선택 시 페이지 초기화
  };

  /* ================= 페이지네이션 ================= */
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

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortedStudents = useMemo(() => {
    return allStudents
      .slice()
      .sort((a, b) => {
        const aCurrent = assignedStudents.includes(a.id);
        const bCurrent = assignedStudents.includes(b.id);
        if (aCurrent && !bCurrent) return -1;
        if (!aCurrent && bCurrent) return 1;
        const aOther = a.assignedAdmins.length > 0;
        const bOther = b.assignedAdmins.length > 0;
        if (!aCurrent && aOther && !bOther) return 1;
        if (!bCurrent && !aOther && bOther) return -1;
        return 0;
      });
  }, [allStudents, assignedStudents]);

  const filteredStudents = useMemo(() => {
    return sortedStudents.filter(s => s.name.includes(studentSearch) || s.email.includes(studentSearch));
  }, [sortedStudents, studentSearch]);

  const paginatedStudents = useMemo(() => {
    const total = filteredStudents.length;
    setTotalPages(Math.ceil(total / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  useEffect(() => setCurrentPage(1), [studentSearch]);
  useEffect(() => setAdminCurrentPage(1), [adminSearch]);

  return (
    <>
      <div className="grid grid-cols-[360px,1fr] gap-6">
        {/* 관리자 목록 */}
        <Card className="joyride-admin-list">
          <CardHeader className="space-y-3">
            <div className="flex justify-between items-center">
              <CardTitle>관리자 목록</CardTitle>
              {myRole === "SUPER_ADMIN"&& (
                <div className="flex gap-2">
                  <Button className="joyride-admin-add" size="sm" onClick={() => setAddModal(true)}>
                    <ShieldPlus className="h-4 w-4 mr-1" /> 관리자 추가
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
  {loadingAdmins ? (
    <LoadingSpinner />
  ) : filteredAdminsPaginated.length === 0 ? (
    <div className="text-center text-sm text-muted-foreground py-4">
      등록된 관리자가 없습니다.
    </div>
  ) : (
    <>
      {/* 검색 */}
      <div className="mb-4 joyride-admin-search">
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

      {filteredAdminsPaginated.map(admin => {
  const isMe = admin.id === myAdminId;
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
          <div className="flex gap-2 items-center joyride-admin-badge">
            <span className="font-medium">{admin.name}</span>
            {isMe && <Badge>내 그룹</Badge>}
            <Badge variant={admin.role === "SUPER_ADMIN" ? "destructive" : "secondary"}>
              {admin.role === "SUPER_ADMIN" ? "슈퍼 관리자" : "관리자"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">{admin.email}</div>
        </div>

        {myRole === "SUPER_ADMIN" && !isMe && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {/* 권한 변경 */}
            <Button className="joyride-admin-change-role"
              size="icon"
              variant="ghost"
              onClick={() => setConfirmModal({ type: "role", target: admin })}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>

            {/* 삭제 버튼 */}
            <Button className="joyride-admin-delete"
              size="icon"
              variant="destructive"
              onClick={() => setConfirmModal({ type: "delete", target: admin })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
})}


      {/* 페이지네이션 */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setAdminCurrentPage(p => Math.max(1, p - 1))}
          disabled={adminCurrentPage === 1}
        >
          이전
        </Button>
        <span className="text-sm">{adminCurrentPage} / {adminTotalPages}</span>
        <Button
          onClick={() => setAdminCurrentPage(p => Math.min(adminTotalPages, p + 1))}
          disabled={adminCurrentPage === adminTotalPages}
        >
          다음
        </Button>
      </div>
    </>
  )}
</CardContent>
        </Card>

        {/* 학생 관리 */}
        <Card className="joyride-student-list">
          <CardHeader>
            <CardTitle>{selectedAdmin ? `${selectedAdmin.name} 담당 그룹` : "담당 그룹"}</CardTitle>
          </CardHeader>
          <CardContent>
  {loadingStudents || saving ? (
    <LoadingSpinner />
  ) : paginatedStudents.length === 0 ? (
    <div className="text-center text-sm text-muted-foreground py-4">
      등록된 학생이 없습니다.
    </div>
  ) : (
    <>
      {/* 검색 */}
      <div className="mb-4 joyride-group-student-search">
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

      <div className="space-y-2">
        {paginatedStudents.map(student => (
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

      {/* 페이지네이션 */}
      <div className="flex justify-between mt-4">
        <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</Button>
        <span className="text-sm">{currentPage} / {totalPages}</span>
        <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</Button>
      </div>

      {/* 학생 저장 버튼 */}
      <Button
        className="w-full mt-4"
        onClick={saveAssignment}
        disabled={
          !selectedAdminId || JSON.stringify(checkedStudents) === JSON.stringify(assignedStudents)
        }
      >
        담당 학생 저장
      </Button>
    </>
  )}
</CardContent>
        </Card>
      </div>

      {/* 모달 */}
      {addModal && (
        <ConfirmModal title="관리자 추가" onClose={() => setAddModal(false)} onConfirm={addAdmin}>
          <Input
        placeholder="관리자 이메일"
        value={newAdminEmail}
        onChange={handleEmailChange}
      />
      {!isEmailValid && <p className="text-xs text-destructive mt-1">이메일 형식이 올바르지 않습니다.</p>}
          <Select value={newAdminRole} onValueChange={v => setNewAdminRole(v as "ADMIN" | "SUPER_ADMIN")}>
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
          onConfirm={() => {
            if (confirmModal.type === "delete" && confirmModal.target) {
              deleteAdmin(confirmModal.target);
            } else if (confirmModal.type === "role" && confirmModal.target) {
              changeRole(confirmModal.target);
            }
          }}
        >
          정말 진행하시겠습니까?
        </ConfirmModal>
      )}


      {!loadingAdmins && !loadingStudents && <GroupManagementJoyride />}
    </>
  );
}
