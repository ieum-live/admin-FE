import Joyride, { Step, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const JOYRIDE_KEY = "adminJoyrideStep";

export function OverviewJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem(JOYRIDE_KEY);

    if ( step === "dashboard") {
      setRun(true);
    }
  }, );

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      disableBeacon: true,
      content: (
        <div>
          <h3 className="font-semibold mb-2">
            📊 전체 대시보드
          </h3>
          <p className="text-sm text-muted-foreground">
            현재 서비스의 사용 현황과 사용자 상태를
            한눈에 확인할 수 있어요.
          </p>
        </div>
      ),
    },
    {
        target: ".joyride-dau-row",
        content: "일 / 주 / 월 / 연 단위의 사용자 활동량을 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-dau-badge",
        content: "전일·전주·전월·전년 대비 어떻게 변화했는지 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-summary-row",
        content: "정식 진단의 요약 지표를 확인 할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },{
        target: ".joyride-summary-row-group",
        content: "전체·내 그룹 필터로 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-summary-badge",
        content: "초록·노랑·빨강 뱃지로 상태 단계를 직관적으로 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-pot-toprank",
        content: "레벨(마음 정원) 1위의 상세 정보 및 TOP 5 사용자를 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-pot-group",
        content: "전체·내 그룹 필터로 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-pot-rank-filter",
        content: "주간·전체 필터를 통해 레벨 1위 및 TOP 5 사용자를 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-user-analytics",
        content: "진단별 색상 선 그래프로 개선 추이를 직관적으로 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-user-analytics-group",
        content: "전체·내 그룹 필터로 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-user-analytics-range",
        content: "기간 필터로 최근 2주·3개월 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
  ];

  return (
    <Joyride
    steps={steps}
      run={run}
      continuous
      showSkipButton
      hideCloseButton
      disableOverlayClose
      locale={{
        back: "이전",
        next: "다음",
        skip: "건너뛰기",
        last: "다음 페이지",
      }}
      styles={{
        options: {
          primaryColor: "#1AA85C",
          zIndex: 10000,
        },
      }}
      callback={(data) => {
        if (
          data.status === STATUS.FINISHED ||
          data.status === STATUS.SKIPPED
        ) {
          localStorage.setItem(JOYRIDE_KEY, "usage-analytics");
          navigate("/usage-analytics");
        }
      }}
    />
  );
}
