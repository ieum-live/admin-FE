import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React from "react";
import { AdminJoyride } from "./Joyride/SidebarJoyride";
import { updateAdminAPI } from "../API/groupManagementAPI";

interface AdminMe {
  id: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

interface AdminEditModalProps {
  me: AdminMe;
  onClose: () => void;
  onUpdate: (updated: Partial<{ name: string; password: string }>) => void;
}

function AdminEditModal({ me, onClose, onUpdate }: AdminEditModalProps) {
  const [name, setName] = useState(me.name);
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    const body: Partial<{ name: string; password: string }> = {};
    if (name !== me.name) body.name = name;
    if (password) body.password = password;

    if (Object.keys(body).length === 0) {
      alert("수정한 내용이 없습니다.");
      return;
    }

    try {
      await updateAdminAPI(me.id, body);
      alert("정보가 업데이트되었습니다.");
      onUpdate(body);
      onClose();
    } catch (e) {
      console.error("관리자 정보 수정 실패", e);
      alert("업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
       <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <CardContent className="space-y-6">
          <h2 className="mt-4 text-lg font-semibold">관리자 정보 수정</h2>

          <div>
            <label className="block mb-1 font-medium">ID</label>
            <Input value={me.id} disabled />
          </div>

          <div>
            <label className="block mb-1 font-medium">역할</label>
            <Input value={me.role} disabled />
          </div>

          <div>
            <label className="block mb-1 font-medium">이름</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 font-medium">비밀번호</label>
            <Input
              type="password"
              placeholder="변경할 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function WelcomePage() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [me, setMe] = useState<AdminMe | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      const stored = localStorage.getItem("me");
      if (stored) {
        setMe(JSON.parse(stored));
      }
    };

    fetchMe();
  }, []);

  const handleUpdateMe = (updated: Partial<{ name: string; password: string }>) => {
    if (!me) return;
    const newMe = { ...me, ...updated };
    setMe(newMe);
    localStorage.setItem("me", JSON.stringify(newMe));
  };

  if (!me) return null;

  return (
    <>
      <AdminJoyride />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[420px]">
          <CardContent className="py-10 flex flex-col items-center text-center gap-6">
            <img
              src="/images/ieumlogo-g.png"
              alt="ieum logo"
              style={{ width: "400px", marginTop: "30px" }}
            />

            <div>
              <h2 className="text-xl font-semibold">처음 오셨나요?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                이음 관리자 페이지 사용을 시작해보세요
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => window.location.href = "/manual"} className="joyride-user-manual">
                📘 사용자 메뉴얼 보기
              </Button>
              <Button variant="outline" onClick={() => setOpenEditModal(true)} className="joyride-user-update">
                🔐 관리자 정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {openEditModal && me && (
        <AdminEditModal
          me={me}
          onClose={() => setOpenEditModal(false)}
          onUpdate={handleUpdateMe}
        />
      )}
    </>
  );
}
