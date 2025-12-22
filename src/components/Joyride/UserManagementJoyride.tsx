import Joyride, { Step, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { MappedUser } from "../UserManagement";

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  depressionStatus: string;
  gamblingStatus: string;
  lastDiagnosis: string;
  diagnosisCount: number;
  improvementRate: string;
  registrationDate: string;
  lastActive: string;
}

interface UserManagementJoyrideProps {
    handleUserClick: (user: MappedUser) => void;
    users: MappedUser[];
  }

const JOYRIDE_KEY = "adminJoyrideStep";

export function UserManagementJoyride({ handleUserClick, users }: UserManagementJoyrideProps) {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem(JOYRIDE_KEY);
    if (step === "user-management") {
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
          <h3 className="font-semibold mb-2">👥 사용자 관리</h3>
          <p className="text-sm text-muted-foreground">
            활성 사용자 현황과 평균 진단 횟수를 확인하고, 전체 사용자 목록을 조회하며 알림을 발송할 수 있는 페이지입니다.
          </p>
        </div>
      ),
    },
    {
      target: ".joyride-user-summary",
      content: "전체/활성/고위험 사용자 수와 평균 진단 횟수를 한눈에 확인할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-user-table",
      content: "전체 사용자 목록에서 ID, 이메일, 나이 등 기본 정보와 우울증·도박 위험도까지 확인할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-user-filter",
      content: "사용자를 검색하거나 우울증·도박 위험도(안정·주의·위험)에 따라 필터링해 확인할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-user-notification",
      content: "선택한 사용자에게 일반·검사·시스템 등 알림을 발송할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".joyride-user-detail",
      content: "각 사용자의 ‘보기’ 버튼을 눌러 개인별 진단 지표와 현재 상태를 확인할 수 있어요.",
      placement: "right",
      disableBeacon: true,
    },
    {
        target: ".joyride-user-info-detail",
        content: "선택한 사용자의 기본 정보를 볼 수 있어요.",
        placement: "right",
        disableBeacon: true,
    },
    {
        target: ".joyride-user-dianosis-result",
        content: "선택한 사용자의 정식 진단별 점수 그래프를 확인할 수 있어요.",
        placement: "right",
        disableBeacon: true,
    },
    {
        target: ".joyride-user-status",
        content: "선택한 사용자의 현재 상태를 확인할 있어요.",
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
        if (data.index === 5 && users.length > 0) {
          handleUserClick(users[0]);
        }

        if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
          localStorage.setItem(JOYRIDE_KEY, "group-management");
          navigate("/group-management");
        }
      }}
    />
  );
}
