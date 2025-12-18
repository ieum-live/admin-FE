import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, UserPlus } from "lucide-react";
import React from "react";

// =====================
// Mock Types
// =====================
interface Admin {
  id: string;
  name: string;
  email: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

// =====================
// Mock Data
// =====================
const mockAdmins: Admin[] = [
  { id: "a1", name: "김OO", email: "kim@admin.com" },
  { id: "a2", name: "박OO", email: "park@admin.com" },
  { id: "a3", name: "이OO", email: "lee@admin.com" },
];

const mockStudents: Student[] = [
  { id: "u1", name: "김학생", email: "kim@student.com" },
  { id: "u2", name: "이학생", email: "lee@student.com" },
  { id: "u3", name: "박학생", email: "park@student.com" },
  { id: "u4", name: "최학생", email: "choi@student.com" },
];

// adminId -> studentIds
const initialAssignments: Record<string, string[]> = {
  a1: ["u1", "u3"],
  a2: ["u2"],
  a3: [],
};

// =====================
// Main Page
// =====================
export function GroupManagement() {
  const [admins] = useState(mockAdmins);
  const [students] = useState(mockStudents);
  const [assignments, setAssignments] = useState<Record<string, string[]>>(initialAssignments);

  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [checkedStudents, setCheckedStudents] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const selectedAdmin = admins.find(a => a.id === selectedAdminId);

  const openAdmin = (adminId: string) => {
    setSelectedAdminId(adminId);
    setCheckedStudents(assignments[adminId] || []);
  };

  const toggleStudent = (id: string) => {
    setCheckedStudents(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const saveAssignment = () => {
    if (!selectedAdminId) return;

    setAssignments(prev => ({
      ...prev,
      [selectedAdminId]: checkedStudents,
    }));

    alert("담당 학생이 저장되었습니다 (Mock)");
  };

  const filteredStudents = students.filter(s =>
    s.name.includes(search) || s.email.includes(search)
  );

  return (
    <div className="grid grid-cols-[360px,1fr] gap-6">
      {/* ================= 관리자 목록 ================= */}
      <Card>
        <CardHeader>
          <CardTitle>관리자 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {admins.map(admin => (
            <button
              key={admin.id}
              onClick={() => openAdmin(admin.id)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selectedAdminId === admin.id
                  ? "bg-muted border-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="font-medium">{admin.name}</div>
              <div className="text-xs text-muted-foreground">{admin.email}</div>
              <div className="mt-1">
                <Badge variant="secondary">
                  담당 {assignments[admin.id]?.length || 0}명
                </Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* ================= 담당 학생 관리 ================= */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedAdmin
              ? `${selectedAdmin.name} 담당 학생`
              : "담당 학생 관리"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedAdmin ? (
            <div className="text-sm text-muted-foreground">
              왼쪽에서 관리자를 선택하세요.
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학생 검색"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[420px] overflow-auto">
                {filteredStudents.map(student => (
                  <label
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedStudents.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                      />
                      <div>
                        <div className="text-sm font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                className="mt-4 w-full gap-2"
                onClick={saveAssignment}
              >
                <UserPlus className="h-4 w-4" />
                이 관리자에게 배정
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
