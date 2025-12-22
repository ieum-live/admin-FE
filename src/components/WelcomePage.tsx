import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { PasswordChangeModal } from "./PasswordChangeModal";
import React from "react";

export function WelcomePage() {
  const [openPwModal, setOpenPwModal] = useState(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[420px]">
          <CardContent className="py-10 flex flex-col items-center text-center gap-6">
            <img
              src="/images/ieumlogo-g.png"
              alt="ieum logo"
              style={{ width: "400px", marginTop: "30px"}}
            />

            <div>
              <h2 className="text-xl font-semibold">처음 오셨나요?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                이음 관리자 페이지 사용을 시작해보세요
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => window.location.href = "/manual"}>
                📘 사용자 메뉴얼 보기
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenPwModal(true)}
              >
                🔐 비밀번호 변경
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {openPwModal && (
        <PasswordChangeModal
          onClose={() => setOpenPwModal(false)}
        />
      )}
    </>
  );
}
