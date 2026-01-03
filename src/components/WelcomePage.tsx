import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AdminJoyride } from "./Joyride/SidebarJoyride";
import { Input } from "./ui/input";
import { getAdminAPI, updateAdminAPI } from "../API/groupManagementAPI";

interface AdminMe {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export function WelcomePage() {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchMyInfo = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;

      try {
        const res = await getAdminAPI(adminId);
        const data = res.data; // data.data 안에 id, name, email, role 있음
        setMe({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setName(data.name);
      } catch (err) {
        console.error("내 관리자 정보 조회 실패", err);
      }
    };

    fetchMyInfo();
  }, []);

  const handleSave = async () => {
    if (!me) return;
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
      setMe(prev => prev ? { ...prev, ...body } : prev);
      setPassword("");
      setOpenEditModal(false);
    } catch (e) {
      console.error("관리자 정보 수정 실패", e);
      alert("업데이트에 실패했습니다.");
    }
  };

  if (!me) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

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
              <Button
                onClick={() => (window.location.href = "/manual")}
                className="joyride-user-manual"
              >
                📘 사용자 메뉴얼 보기
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenEditModal(true)}
                className="joyride-user-update"
              >
                🔐 관리자 정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {openEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <CardContent className="space-y-6">
              <h2 className="mt-4 text-lg font-semibold">관리자 정보 수정</h2>

              <div>
                <label className="block mb-1 font-medium">ID</label>
                <Input value={me.id} disabled />
              </div>

              <div>
                <label className="block mb-1 font-medium">이메일</label>
                <Input value={me.email} disabled />
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
                <Button variant="outline" onClick={() => setOpenEditModal(false)}>
                  취소
                </Button>
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
