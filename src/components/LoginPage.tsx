import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { signIn } from "../API/authAPI";
import React from "react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    // 🔥 빈칸 체크
    if (!email.trim() || !password.trim()) {
      setError("모든 칸을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      onLogin();
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "로그인 중 오류가 발생했습니다.";

      setError("입력 정보를 다시 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="font-bold">이음 관리자</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                disabled={loading}
              />
            </div>

            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
