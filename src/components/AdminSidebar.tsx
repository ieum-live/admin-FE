import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  UserCheck,
  Settings,
  LogOut 
} from "lucide-react";
import { Button } from "./ui/button";

interface AdminSidebarProps {

  activeTab: string;

  onTabChange: (tab: string) => void;

  onLogout: () => void;

}



export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {

  const menuItems = [

    { id: 'dashboard', label: '전체 대시보드', icon: BarChart3 },

    { id: 'usage-analytics', label: '사용량 분석', icon: Activity },

    { id: 'diagnosis-results', label: '진단 결과', icon: TrendingUp },

    { id: 'user-management', label: '사용자 관리', icon: UserCheck },

    { id: 'settings', label: '설정', icon: Settings },

  ];



  return (

    <div className="w-64 bg-card border-r border-border h-screen p-4 flex flex-col">

      <div>

        <div className="mb-8">

          <h1 className="text-xl font-semibold text-primary mb-2">

            우웅 어드민

          </h1>

          <p className="text-sm text-muted-foreground">관리자 대시보드</p>

        </div>



        <nav className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <Button

                key={item.id}

                variant={activeTab === item.id ? "default" : "ghost"}

                className="w-full justify-start gap-3"

                onClick={() => onTabChange(item.id)}

              >

                <Icon className="h-4 w-4" />

                {item.label}

              </Button>

            );

          })}

        </nav>

      </div>



      <div className="mt-auto">

        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={onLogout}>

          <LogOut className="h-4 w-4" />

          로그아웃

        </Button>

      </div>

    </div>

  );

}
