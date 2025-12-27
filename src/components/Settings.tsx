import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ThemeSettings } from "./ThemeSettings";
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Database,
  Bell,
  Mail,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, SettingsData, updateSettings } from "../API/settingAPI";
import NotiBar from "./ui/notiBar";
import React from "react";

export function Settings() {
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [retentionDays, setRetentionDays] = useState(90);
  const [initialSettings, setInitialSettings] = useState<SettingsData | null>(null)
  const [msg, setMsg] = useState("");

  const setFieldsFromData = (data: SettingsData) => {
    setSessionTimeoutMinutes(data.sessionTimeoutMinutes);
    setRetentionDays(data.retentionDays);
    setEmail(data.contact.email);
    setOrgName(data.contact.orgName);
    setPhone(data.contact.phone);
  };

  useEffect(() => {
    const load = async () => {
      const data = await getSettings();
      setInitialSettings(data);
      setFieldsFromData(data);
    };
    load();
  }, []);

  const onClickCancel = async () => {

    if (initialSettings) {
      await setFieldsFromData(initialSettings);
      setMsg("변경이 취소되었습니다.");

      setTimeout(() => setMsg(""), 2000);
    }
  };

  const onClickSave = async () => {
    try {
      const payload = {
        sessionTimeoutMinutes,
        retentionDays,
        contact: {
          orgName,
          email,
          phone,
        },
      };

      await updateSettings(payload);
      setMsg("저장되었습니다.");
      setTimeout(() => setMsg(""), 2000);
    } catch (error) {
    }
  };



  return (
    <div className="space-y-6">
      <NotiBar message={msg} />
      <ThemeSettings />

      {/* 시스템 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            시스템 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">애플리케이션 이름</Label>
              <Input
                id="app-name"
                defaultValue="이음 (ieum)"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">관리자 이메일</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClickCancel}>취소</Button>
        <Button className="gap-2" onClick={onClickSave}>
          <Save className="h-4 w-4" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}