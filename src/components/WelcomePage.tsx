import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AdminJoyride } from "./Joyride/SidebarJoyride";
import { Input } from "./ui/input";
import { getAdminAPI, updateAdminAPI } from "../API/groupManagementAPI";
import LoadingSpinner from "./LoadingSpinner";

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
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기 여부

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyInfo = async () => {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) return;

      try {
        const res = await getAdminAPI(adminId);
        const data = res.data;
        setMe({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setName(data.name);
      } catch (err) {
        console.error("내 관리자 정보 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // 실시간 비밀번호 검증
  useEffect(() => {
    if (!password) {
      setPasswordError("");
      return;
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "비밀번호는 8자 이상, 영어+숫자+특수문자를 포함해야 합니다."
      );
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleSave = async () => {
    if (!me) return;
    if (password && passwordError) {
      alert("비밀번호 조건을 만족해야 합니다.");
      return;
    }

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

  // 취소 시 입력 초기화
  const handleCancel = () => {
    if (!me) return;
    setName(me.name);
    setPassword("");
    setPasswordError("");
    setShowPassword(false);
    setOpenEditModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!me) {
    return <div className="min-h-screen flex items-center justify-center">관리자 정보가 없습니다.</div>;
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

              <div className="relative">
                <label className="block mb-1 font-medium">비밀번호</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "숨기기" : "보기"}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={!!passwordError}>
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
