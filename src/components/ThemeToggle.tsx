import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import React from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 초기 테마 설정 (시스템 설정 또는 저장된 설정 확인)
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // DOM 클래스 업데이트
    document.documentElement.classList.toggle('dark', newTheme);
    
    // 로컬스토리지에 저장
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 px-2"
      title={isDark ? "라이트 모드로 변경" : "다크 모드로 변경"}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden md:inline">라이트</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden md:inline">다크</span>
        </>
      )}
    </Button>
  );
}