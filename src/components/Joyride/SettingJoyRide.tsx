import Joyride, { Step, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const JOYRIDE_KEY = "adminJoyrideStep";

interface Props {
    selectedAdminId: string | null;
    loadingStudents: boolean;
    saving: boolean;
  }

export function SettingJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  
  useEffect(() => {
      const step = localStorage.getItem(JOYRIDE_KEY);
      if (step === "setting") {
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
            <h3 className="font-semibold mb-2">⚙️ 설정</h3>
            <p className="text-sm text-muted-foreground">
              화면 테마를 변경하고, 어플 이름과 대표 관리자 이메일 정보를 확인할 수 있어요.
            </p>
          </div>
        ),
      },
      
    {
      target: ".joyride-setting-theme",
      content: "화면 테마를 설정할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
        target: ".joyride-setting-info",
        content: "어플 이름을 확인하고 대표 관리자 이메일을 확인 및 수정할 수 있어요.",
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
        last: "완료",
      }}
      styles={{
        options: {
          primaryColor: "#1AA85C",
          zIndex: 10000,
        },
      }}
      callback={(data) => {
        if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
          localStorage.setItem(JOYRIDE_KEY, "done");
          navigate("/"); // 필요 시 이동
        }
      }}
    />
  );
}
