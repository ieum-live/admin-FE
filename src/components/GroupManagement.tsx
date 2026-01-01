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
import { getAdminAPI, getAdminsAPI, addAdminAPI, deleteAdminAPI } from "../API/groupManagementAPI";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { getMyId } from "../API/authAPI";

/* ================= 타입 ================= */
interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface Student {
  id: string;
  name: string;
  email: string;
}

const mockStudents: Student[] = [
  { id: "u1", name: "김학생", email: "kim@student.com" },
  { id: "u2", name: "이학생", email: "lee@student.com" },
  { id: "u3", name: "박학생", email: "park@student.com" },
];

const initialAssignments: Record<string, string[]> = {
  a1: ["u1"],
  a2: ["u2"],
  a3: [],
};

export function GroupManagement() {

  const [me, setMe] = useState<Admin | null>(null);

useEffect(() => {
  const myAdminId = getMyId();
  if (!myAdminId) return;

  const fetchAdmin = async () => {
    const res = await getAdminAPI(myAdminId);
    setMe(res.data);
  };

  fetchAdmin();
}, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdminsAPI();
        console.log("목록", data)
        setAdmins(data);
  
      } catch (e) {
        console.error("관리자 목록 조회 실패", e);
      }
    };
  
    fetchAdmins();
  }, []);

  const [admins, setAdmins] = useState<Admin[]>([])
  const [students] = useState(mockStudents);
  const [assignments, setAssignments] = useState(initialAssignments);

  const currentAdminId = me?.id;
  const isSuperAdmin = me?.role === "SUPER_ADMIN";


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


  /* ================= 관리자 추가 ================= */
  const addAdmin = () => {
    setAdmins(prev => [
      ...prev,
      {
        id: `a${prev.length + 1}`,
        name: "신규 관리자",
        email: newAdminEmail,
        role: "ADMIN",
      },
    ]);
    setNewAdminEmail("");
    setAddModal(false);
  };
  /*const addAdmin = async () => {
    if (!newAdminEmail) return;
  
    try {
      await addAdminAPI({
        email: newAdminEmail,
        role: newAdminRole,
      });
  
      setAddModal(false);
      setNewAdminEmail("");
      setNewAdminRole("ADMIN");
  
    } catch (e) {
      console.error("관리자 추가 실패", e);
    }
  };*/


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
  
    return base.filter(
      a =>
        a.name.includes(adminSearch) ||
        a.email.includes(adminSearch)
    );
  }, [admins, adminSearch, isSuperAdmin, me]);
  
  

  /* ================= 학생 토글 ================= */
  const toggleStudent = (id: string) => {
    setCheckedStudents(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  };

  /* ================= 권한 변경 ================= */
  const changeRole = (admin: Admin) => {
    setAdmins(prev =>
      prev.map(a =>
        a.id === admin.id
          ? {
              ...a,
              role:
                a.role === "ADMIN"
                  ? "SUPER_ADMIN"
                  : "ADMIN",
            }
          : a
      )
    );
    setConfirmModal(null);
  };

  /* ================= 관리자 삭제 ================= */
  const deleteAdmins = () => {
    setAdmins(prev =>
      prev.filter(
        a =>
          !selectedAdmins.includes(a.id) ||
          a.id === currentAdminId
      )
    );
    setSelectedAdmins([]);
    setConfirmModal(null);
  };

  /* const deleteAdmins = async () => {
    try {
      // 본인 제외한 삭제 대상
      const targetAdminIds = selectedAdmins.filter(
        (id) => id !== currentAdminId
      );
  
      if (targetAdminIds.length === 0) {
        setConfirmModal(null);
        setSelectedAdmins([]);
        return;
      }
  
      // DELETE 요청 병렬 처리
      await Promise.all(
        targetAdminIds.map((adminId) => deleteAdminAPI(adminId))
      );
  
      // 성공 시 로컬 상태 갱신
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
  }; */

  /* ================= 학생 담당 저장 ================= */
const saveAssignment = () => {
    if (!selectedAdminId) return;
  
    setAssignments(prev => ({
      ...prev,
      [selectedAdminId]: checkedStudents,
    }));
  
    alert("담당 학생이 저장되었습니다 (Mock)");
  };
  

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-[360px,1fr] gap-6">
      {/* ================= 관리자 목록 ================= */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex justify-between items-center">
            <CardTitle>관리자 목록</CardTitle>

            {isSuperAdmin && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setAddModal(true)}
                >
                  <ShieldPlus className="h-4 w-4 mr-1" />
                  관리자 추가
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!selectedAdmins.length}
                  onClick={() =>
                    setConfirmModal({ type: "delete" })
                  }
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            )}
          </div>

          <Input
            placeholder="관리자 검색"
            value={adminSearch}
            onChange={e => setAdminSearch(e.target.value)}
          />
        </CardHeader>

        <CardContent className="space-y-2">
          {filteredAdmins.map(admin => {
            const isMe = admin.id === currentAdminId;

            return (
                <div
                key={admin.id}
                onClick={() => {
                  if (!isSuperAdmin && admin.id !== currentAdminId) return;
                
                  setSelectedAdminId(admin.id);
                  setCheckedStudents(assignments[admin.id]);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition
                  ${
                    selectedAdminId === admin.id
                      ? "bg-muted border-primary"
                      : "hover:bg-muted"
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  {/* 왼쪽 정보 */}
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">{admin.name}</span>
              
                      {isMe && <Badge>내 그룹</Badge>}
              
                      <Badge
                        variant={
                          admin.role === "SUPER_ADMIN"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {admin.role === "SUPER_ADMIN"
                          ? "슈퍼 관리자"
                          : "관리자"}
                      </Badge>
                    </div>
              
                    <div className="text-xs text-muted-foreground">
                      {admin.email}
                    </div>
                  </div>
              
                  {/* 오른쪽 액션 */}
                  {isSuperAdmin && !isMe && (
                    <div
                      className="flex gap-1"
                      onClick={e => e.stopPropagation()} // ⭐ 핵심
                    >
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin.id)}
                        onChange={() =>
                          setSelectedAdmins(prev =>
                            prev.includes(admin.id)
                              ? prev.filter(v => v !== admin.id)
                              : [...prev, admin.id]
                          )
                        }
                      />
              
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setConfirmModal({
                            type: "role",
                            target: admin,
                          })
                        }
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>              
            );
          })}
        </CardContent>
      </Card>

      {/* ================= 학생 관리 ================= */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedAdmin
              ? `${selectedAdmin.name} 담당 학생`
              : "담당 학생"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="학생 검색"
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
            className="mb-3"
          />

          <div className="space-y-2">
            {students
              .filter(
                s =>
                  s.name.includes(studentSearch) ||
                  s.email.includes(studentSearch)
              )
              .map(student => (
                <label
                  key={student.id}
                  className="flex gap-2 p-2 hover:bg-muted rounded"
                >
                  <input
                    type="checkbox"
                    checked={checkedStudents.includes(student.id)}
                    onChange={() =>
                      toggleStudent(student.id)
                    }
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {student.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {student.email}
                    </div>
                  </div>
                </label>
              ))}
          </div>
          <Button
    className="w-full mt-4"
    onClick={saveAssignment}
    disabled={!selectedAdminId}
  >
    담당 학생 저장
  </Button>
        </CardContent>
      </Card>

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

          <Select
            value={newAdminRole}
            onValueChange={(v) => setNewAdminRole(v as "ADMIN" | "SUPER_ADMIN")}
          >
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
            <p>
              • 기본 비밀번호: <b>ieum1234!</b>
            </p>
            <p>• 최초 로그인 후 이름/비밀번호 변경 권장</p>
          </div>
        </ConfirmModal>
      )}


      {/* ================= 확인 모달 ================= */}
      {confirmModal && (
        <ConfirmModal
          title={
            confirmModal.type === "delete"
              ? "관리자 삭제"
              : "권한 변경"
          }
          onClose={() => setConfirmModal(null)}
          onConfirm={() =>
            confirmModal.type === "delete"
              ? deleteAdmins()
              : confirmModal.target &&
                changeRole(confirmModal.target)
          }
        >
          정말 진행하시겠습니까?
        </ConfirmModal>
      )}
    </div>
  );
}

/* ================= 공용 확인 모달 ================= */
function ConfirmModal({
  title,
  children,
  onClose,
  onConfirm,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[360px]">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{title}</CardTitle>
          <button onClick={onClose}>
            <X />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
            >
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
