import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const JOYRIDE_KEY = "adminJoyrideStep";

export function AdminJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem(JOYRIDE_KEY);
    if (step !== "done") {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      disableBeacon: true,
      content: (
        <div>
          <h3 className="font-semibold mb-2">
            👋 이음 관리자 페이지에 오신 것을 환영합니다!
          </h3>
          <p className="text-sm text-muted-foreground">
            지금부터 주요 기능을 간단히 안내해드릴게요.
            <br />
            <b>건너뛰기</b>를 누르면 다음 페이지로 넘어갈 수 있습니다.
            <br/>
            메뉴얼을 보고 싶다면 <b>다음</b>을 눌러주세요🙂
          </p>
        </div>
      ),
    },

    {
      target: ".joyride-sidebar",
      content: "왼쪽 사이드바에서 모든 관리자 기능으로 이동할 수 있습니다.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-dashboard-card",
      content: "서비스 전체 현황을 한눈에 확인할 수 있습니다.",
      disableBeacon: true,
    },
    {
      target: ".joyride-usage-analytics",
      content: "기능별 사용 현황과 추이를 분석할 수 있습니다.",
      disableBeacon: true,
    },
    {
      target: ".joyride-diagnosis-results",
      content: "사용자 검사 결과를 확인하고 파일로 다운로드할 수 있습니다.",
      disableBeacon: true,
    },
    {
      target: ".joyride-user-management",
      content: "사용자 상태를 확인하고 알림을 발송할 수 있습니다.",
      disableBeacon: true,
    },
    {
      target: ".joyride-group-management",
      content: "관리자 권한과 학생 그룹을 관리할 수 있습니다.",
      disableBeacon: true,
    },
    {
      target: ".joyride-settings",
      content: "화면 테마와 관리자 정보를 설정할 수 있습니다.",
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
      localStorage.setItem(JOYRIDE_KEY, "dashboard");
      navigate("/dashboard");
    }
  }}
/>
  );
}
