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

export function GroupManagementJoyride() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  
  useEffect(() => {
      const step = localStorage.getItem(JOYRIDE_KEY);
      if (step === "group-management") {
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
          <h3 className="font-semibold mb-2">👩‍💼 관리자 그룹 관리</h3>
          <p className="text-sm text-muted-foreground">
            관리자와 학생 그룹을 한눈에 보고, 역할 변경과 학생 배정을 쉽게 관리할 수 있어요.
          </p>
        </div>
      ),
    },
    {
      target: ".joyride-admin-list",
      content: "관리자 목록에서 관리자 정보를 확인하고 선택해서 그룹 정보를 볼 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-admin-add",
      content: "슈퍼 관리자는 새 관리자를 추가할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-admin-delete",
      content: "슈퍼 관리자는 체크한 관리자를 삭제할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
        target: ".joyride-admin-search",
        content: "이름과 이메일으로 관리자을 검색할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
    {
        target: ".joyride-admin-change-role",
        content: "슈퍼 관리자는 슈퍼 관리지 <-> 관리자 권한 변경을 할 수 있어요 (본인 제외).",
        placement: "right",
        disableBeacon: true,
    },
    {
      target: ".joyride-student-list",
      content: "선택한 관리자의 담당 학생 목록을 확인하고 추가/삭제할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
        target: ".joyride-group-student-search",
        content: "이름과 이메일으로 학생을 검색할 수 있어요.",
        placement: "right",
        disableBeacon: true,
      },
    {
      target: ".joyride-student-save",
      content: "변경한 학생 배정을 저장하려면 여기를 클릭하세요.",
      placement: "bottom",
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
