import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Calendar, TrendingUp, Activity } from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      title: "일일 활성 사용자 (DAU)",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
      period: "전일 대비"
    },
    {
      title: "주간 활성 사용자 (WAU)",
      value: "5,832",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Calendar,
      period: "전주 대비"
    },
    {
      title: "월간 활성 사용자 (MAU)",
      value: "18,956",
      change: "+15.7%",
      changeType: "increase" as const,
      icon: TrendingUp,
      period: "전월 대비"
    },
    {
      title: "연간 활성 사용자 (YAU)",
      value: "156,432",
      change: "+24.3%",
      changeType: "increase" as const,
      icon: Activity,
      period: "전년 대비"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span 
                  className={`${
                    stat.changeType === 'increase' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  } font-medium mr-1`}
                >
                  {stat.change}
                </span>
                {stat.period}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}