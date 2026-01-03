import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Monitor, Moon, Sun } from "lucide-react";
import React from "react";

type Theme = 'light' | 'dark' | 'system';

export function ThemeSettings() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    
    if (newTheme === 'system') {
      // 시스템 설정 따라가기
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      localStorage.removeItem('theme');
    } else {
      // 사용자 선택 적용
      const isDark = newTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', newTheme);
    }
  };

  const getCurrentThemeDisplay = () => {
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? '시스템 (다크)' : '시스템 (라이트)';
    }
    return theme === 'dark' ? '다크 모드' : '라이트 모드';
  };

  return (
    <Card className="joyride-setting-theme">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          화면 테마 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>테마 모드 선택</Label>
          <RadioGroup value={theme} onValueChange={applyTheme} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
              <RadioGroupItem value="light" id="light" />
              <div className="flex items-center gap-3 flex-1">
                <Sun className="h-4 w-4 text-orange-500" />
                <div>
                  <Label htmlFor="light" className="cursor-pointer">
                    라이트 모드
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    밝은 배경의 기본 테마
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
              <RadioGroupItem value="dark" id="dark" />
              <div className="flex items-center gap-3 flex-1">
                <Moon className="h-4 w-4 text-blue-500" />
                <div>
                  <Label htmlFor="dark" className="cursor-pointer">
                    다크 모드
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    어두운 배경의 테마로 눈의 피로감 감소
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
              <RadioGroupItem value="system" id="system" />
              <div className="flex items-center gap-3 flex-1">
                <Monitor className="h-4 w-4 text-green-500" />
                <div>
                  <Label htmlFor="system" className="cursor-pointer">
                    시스템 설정 따라가기
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    운영체제의 테마 설정에 맞춰 자동 변경
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">현재 적용된 테마</span>
            <span className="text-sm text-muted-foreground">
              {getCurrentThemeDisplay()}
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💡 팁: 시스템 설정을 선택하면 컴퓨터의 테마 설정에 따라 자동으로 라이트/다크 모드가 전환됩니다.</p>
        </div>
      </CardContent>
    </Card>
  );
}