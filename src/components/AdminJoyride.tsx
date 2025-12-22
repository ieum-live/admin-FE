import Joyride, { Step } from "react-joyride";
import { useEffect, useState } from "react";
import React from "react";

export function AdminJoyride() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    {/*const done = localStorage.getItem("joyrideDone");
    if (!done)*/} 
    setRun(true);
  }, []);

  const steps: Step[] = [
    {
      target: ".joyride-sidebar",
      content: "서비스 전체 현황을 한눈에 확인합니다.",
      placement: "right",
    },
    {
      target: ".joyride-dashboard-card",
      content: "서비스 전체 현황을 한눈에 확인하는 대시보드입니다.",
    },
    {
        target: ".joyride-usage-analytics",
        content: "기능별 사용 현황과 추이를 분석합니다..",
    },
    {
        target: ".joyride-diagnosis-results",
        content: "사용자 검사 결과를 확인하고 관리합니다.",
    },
    {
      target: ".joyride-user-management",
      content: "사용자 상태와 개별 정보를 관리합니다.",
    },
    {
      target: ".joyride-group-management",
      content: "관리자 권한과 학생 그룹을 관리합니다.",
    },
    {
        target: ".joyride-settings",
        content: "설정을 변경합니다.",
      },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      styles={{
        options: {
          primaryColor: "#22c55e", // 초록 (이음 톤)
          zIndex: 10000,
        },
      }}
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          localStorage.setItem("joyrideDone", "true");
          setRun(false);
        }
      }}
    />
  );
}
