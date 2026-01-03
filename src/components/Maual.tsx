import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const JOYRIDE_KEY = "adminJoyrideStep";

export function UserManualPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="text-center pt-2 pb-6">
      <Button
          variant="outline"
          onClick={() => {
            localStorage.setItem(JOYRIDE_KEY, "false");
            navigate("/");
          }}
        >
          🔄 사용 가이드 보기
        </Button>
      </div>

      {/* 카드 그리드 */}
      <div className="grid md:grid-cols-2 gap-6">
        <ManualCard
          emoji="📊"
          title="전체 대시보드"
          desc="서비스 전체 현황을 한눈에 확인합니다."
          items={[
            "DAU / WAU / MAU / YAU",
            "전체 개선율 · 안정군 비율",
            "총 진단 횟수 · 평균 진단 간격",
            "화분 레벨 순위",
            "진단별 개선 지표",
          ]}
        />

        <ManualCard
          emoji="📈"
          title="사용량 분석"
          desc="기능별 사용 현황과 추이를 분석합니다."
          items={[
            "활성 기능 순위 (기간별)",
            "기능별 사용 추세 (기능 / 기간)",
          ]}
        />

        <ManualCard
          emoji="🧪"
          title="진단 결과"
          desc="사용자 검사 결과를 확인하고 관리합니다."
          items={[
            "위험도 사용자 분포 추이",
            "검사 결과 CSV 다운로드",
          ]}
        />

        <ManualCard
          emoji="👥"
          title="사용자 관리"
          desc="사용자 상태와 개별 정보를 관리합니다."
          items={[
            "전체 / 고위험군 / 활성 사용자 수",
            "사용자 목록 및 알림 발송",
            "개인별 진단 결과 및 위험 요소",
            "개인 별 화분 레벨 상세 보기",
          ]}
        />

        <ManualCard
          emoji="🛡️"
          title="관리자 · 그룹 관리"
          desc="관리자 권한과 학생 그룹을 관리합니다."
          items={[
            "슈퍼 관리자: 관리자 추가 · 삭제 · 권한 변경",
            "관리자: 학생 그룹 생성 · 수정",
          ]}
        />

        <ManualCard
          emoji="⚙️"
          title="설정"
          desc="설정을 변경합니다."
          items={[
            "화면 테마 설정 (라이트 / 다크)",
            "관리자 이름 및 이메일",
          ]}
        />
      </div>

    </div>
  );
}

function ManualCard({
  emoji,
  title,
  desc,
  items,
}: {
  emoji: string;
  title: string;
  desc: string;
  items: string[];
}) {

  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2`}>
          <span className="text-m">{emoji}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground text-xs">{desc}</p>

        <ul className="ml-1 space-y-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-xs flex gap-2"
            >
              <span className="text-muted-foreground">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
