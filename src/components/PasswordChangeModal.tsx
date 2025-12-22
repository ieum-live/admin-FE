import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import React from "react";

export function PasswordChangeModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");

  // 🔐 비밀번호 규칙
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const validate = () => {
    if (!currentPw) {
      setError("현재 비밀번호를 입력해주세요.");
      return false;
    }

    if (!passwordRegex.test(newPw)) {
      setError(
        "새 비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
      );
      return false;
    }

    if (newPw !== confirmPw) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // TODO: API 연동
    alert("비밀번호가 변경되었습니다 (Mock)");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>비밀번호 변경</CardTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
          />

          <Input
            type="password"
            placeholder="새 비밀번호"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
          />

          <Input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            영문, 숫자, 특수문자를 포함하여 8자 이상
          </p>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button className="w-full" onClick={handleSubmit}>
            변경하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
