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
      console.log("설정 자동 저장 완료:", payload);
    } catch (error) {
      console.error("설정 자동 저장 실패:", error);
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
                defaultValue="청소년 진단 프로그램"
                placeholder="애플리케이션 이름"
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

          <div className="space-y-2">
            <Label htmlFor="maintenance-mode">점검 모드</Label>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <span className="text-sm text-muted-foreground">
                점검 모드 활성화 시 일반 사용자 접근이 제한됩니다.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">세션 타임아웃 (분)</Label>
            <Select
              value={String(sessionTimeoutMinutes)}
              onValueChange={(value: string) => setSessionTimeoutMinutes(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15분</SelectItem>
                <SelectItem value="30">30분</SelectItem>
                <SelectItem value="60">1시간</SelectItem>
                <SelectItem value="120">2시간</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>고위험군 알림</Label>
                <p className="text-sm text-muted-foreground">
                  고위험군 사용자 발견 시 즉시 알림
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>일일 리포트</Label>
                <p className="text-sm text-muted-foreground">
                  매일 오후 6시 통계 리포트 발송
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>시스템 경고</Label>
                <p className="text-sm text-muted-foreground">
                  시스템 오류 및 장애 발생시 알림
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="notification-email">알림 수신 이메일</Label>
            <Input
              id="notification-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="알림을 받을 이메일"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sms-number">SMS 수신 번호</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* 데이터 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>데이터 보존 기간</Label>
              <Select
                value={String(retentionDays / 30)}
                onValueChange={(value: string) => setRetentionDays(Number(value) * 30)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1개월</SelectItem>
                  <SelectItem value="3">3개월</SelectItem>
                  <SelectItem value="6">6개월</SelectItem>
                  <SelectItem value="12">12개월 (1년)</SelectItem>
                  <SelectItem value="24">24개월 (2년)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>자동 백업 주기</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">매일</SelectItem>
                  <SelectItem value="weekly">매주</SelectItem>
                  <SelectItem value="monthly">매월</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              데이터 내보내기
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              데이터 가져오기
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              백업 실행
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">마지막 백업</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024년 10월 6일 오전 3:00 (자동 백업)
            </p>
            <Badge variant="default" className="mt-2 bg-green-100 text-green-800">
              백업 완료
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 보안 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            보안 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>2단계 인증</Label>
                <p className="text-sm text-muted-foreground">
                  관리자 계정에 2단계 인증 적용
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>IP 화이트리스트</Label>
                <p className="text-sm text-muted-foreground">
                  특정 IP에서만 관리자 접근 허용
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>접속 로그 기록</Label>
                <p className="text-sm text-muted-foreground">
                  모든 관리자 접속 기록 저장
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-policy">비밀번호 정책</Label>
            <Textarea
              id="password-policy"
              defaultValue="최소 8자 이상, 영문 대소문자, 숫자, 특수문자 포함"
              placeholder="비밀번호 정책을 입력하세요"
              rows={3}
            />
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