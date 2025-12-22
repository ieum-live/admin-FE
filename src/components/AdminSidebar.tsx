import {
  BarChart3,
  Activity,
  TrendingUp,
  UserCheck,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";


interface AdminSidebarProps {
    onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const location = useLocation();
    const activeTab = location.pathname;
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            const theme = localStorage.getItem("theme");
            const systemPrefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDark(theme === "dark" || (!theme && systemPrefersDark));
        };

        checkTheme();

        // 테마 변경 감지
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

  const menuItems = [
    { path: "/dashboard", label: "전체 대시보드", icon: BarChart3 },
    { path: "/usage-analytics", label: "사용량 분석", icon: Activity },
    { path: "/diagnosis-results", label: "진단 결과", icon: TrendingUp },
    { path: "/user-management", label: "사용자 관리", icon: UserCheck },
    { path: "/group-management", label: "관리자 / 그룹 관리", icon: UserCog },
    { path: "/settings", label: "설정", icon: Settings },
  ];

    return (
        <div className="w-64 bg-card border-r border-border h-screen p-4 flex flex-col">
            <div>
            <Link to="/">
                <div className="mb-8">
                    <img
                        src={
                            isDark
                                ? "/images/ieumlogo-w.png"
                                : "/images/ieumlogo-g.png"
                        }
                        alt="이음 로고"
                        className="h-12 w-auto mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                        이음 관리자 대시보드
                    </p>
                </div>
                </Link>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link to={item.path} key={item.path}>
                                <Button
                                    variant={
                                        activeTab === item.path
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="w-full justify-start gap-3"
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground"
                    onClick={onLogout}
                >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                </Button>
            </div>
        </div>
    );
}
