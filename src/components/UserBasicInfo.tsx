import { useEffect, useState } from "react";
import { getUserDetail } from "../API/userManagementAPI";
import LoadingSpinner from "./LoadingSpinner";
import React from "react";

export function UserBasicInfo({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const detail = await getUserDetail(userId);
      setUser(detail.basic);
    };
    load();
  }, [userId]);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">사용자 ID</span>
        <span>{user.id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">이름</span>
        <span>{user.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">이메일</span>
        <span>{user.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">성별</span>
        <span>{user.gender}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">생년월일</span>
        <span>{user.birthDate}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">가입일</span>
        <span>{new Date(user.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
