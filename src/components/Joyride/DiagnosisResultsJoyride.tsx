import Joyride, { Step, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const JOYRIDE_KEY = "adminJoyrideStep";

export function DiagnosisResultsJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem(JOYRIDE_KEY);

    if ( step === "diagnosis-results") {
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
          🧪 진단 결과
          </h3>
          <p className="text-sm text-muted-foreground">
          정식 진단 결과별 위험도 분포와 사용자 검사 데이터를 확인할 수 있어요.
          </p>
        </div>
      ),
    },
    {
        target: ".joyride-risk-trend",
        content: "정식 진단별로 LOW·MID·HIGH 위험군 분포 추이를 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-risk-trend-filter1",
        content: "PHQ-9·CAGI 등 정식 진단 중 원하는 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-risk-trend-filter2",
        content: "기간 필터로 최근 2주·1개월·3개월·6개월 데이터를 선택해 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-user-diagnosis-results",
        content: "선택한 필터에 맞춰 사용자 목록을 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
      {
        target: ".joyride-user-diagnosis-results-csv",
        content: "선택한 필터에 맞는 전체 사용자 목록을 csv파일로 다운로드 할 수 있어요.",
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
          localStorage.setItem(JOYRIDE_KEY, "user-management");
          navigate("/user-management");
        }
      }}
    />
  );
}
