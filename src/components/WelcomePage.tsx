import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AdminJoyride } from "./Joyride/SidebarJoyride";

export function WelcomePage() {
  const [openEditModal, setOpenEditModal] = useState(false);

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

      {openEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <CardContent className="space-y-6">
              <h2 className="mt-4 text-lg font-semibold">관리자 정보 수정</h2>
              <p className="text-sm text-muted-foreground">관리자 정보 수정 기능은 현재 구현되지 않았습니다.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpenEditModal(false)}>
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
