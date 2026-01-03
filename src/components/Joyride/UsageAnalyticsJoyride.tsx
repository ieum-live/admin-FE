import Joyride, { Step, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const JOYRIDE_KEY = "adminJoyrideStep";

export function UsageAnalyticsJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem(JOYRIDE_KEY);

    if ( step === "usage-analytics") {
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
          📈 사용량 분석
          </h3>
          <p className="text-sm text-muted-foreground">
           활성 기능과 기능별 사용추이를 한눈에 확인할 수 있어요.
          </p>
        </div>
      ),
    },
    {
        target: ".joyride-top5",
        content: "기능 사용 횟수에 따라 활성 기능 TOP5를 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-top5-filter-group",
        content: "전체·내 그룹 필터로 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-top5-filter",
        content: "기간 필터로 오늘·최근 2주·3개월 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-trend",
        content: "주요 기능별로 사용량 추이를 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-trend-filter-group",
        content: "전체·내 그룹 필터로 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-trend-filter1",
        content: "정식진단·퀘스트·일기 등 주요 기능을 선택해서 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-trend-filter2",
        content: "기간 필터로 최근 2주·1개월·3개월·6개월 데이터를 선택해 볼 수 있어요.",
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
          localStorage.setItem(JOYRIDE_KEY, "diagnosis-results");
          navigate("/diagnosis-results");
        }
      }}
    />
  );
}
