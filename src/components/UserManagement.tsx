import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Search, MessageSquare, Bell, Mail, Eye, Filter, X } from "lucide-react";
import { UserDetail } from "./UserDetail";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { getUserStatistics, getUserDetail, getUsers } from "../API/userManagementAPI";
import LoadingSpinner from "./LoadingSpinner";
import { AlertType, sendBulkAlert } from "../API/alertAPI";
import { UserBasicInfo } from "./UserBasicInfo";
import React from "react";
import {UserManagementJoyride} from "./Joyride/UserManagementJoyride"

interface BasicUser {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  email: string;
}

interface UserDetailStatus {
  depression: 'LOW' | 'MEDIUM' | 'HIGH';
  gambling: 'LOW' | 'MEDIUM' | 'HIGH';
  totalAssessments: number;
  latestAssessmentDate: string;
  improvementRate: number;
  riskFactors: string[];
}

interface FullUser {
  basic: BasicUser;
  status: UserDetailStatus;
}

export interface MappedUser {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  depressionStatus: 'low' | 'medium' | 'high';
  gamblingStatus: 'low' | 'medium' | 'high';
  lastDiagnosis: string;
  diagnosisCount: number;
  improvementRate: string;
  registrationDate: string;
  lastActive: string;
  potLevel: number;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [depressionFilter, setDepressionFilter] = useState("all");
  const [gamblingFilter, setGamblingFilter] = useState("all");
  const [users, setUsers] = useState<MappedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MappedUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [highRiskUsers, setHighRiskUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [averageDiagnoses, setAverageDiagnoses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [componentLoading, setComponentLoading] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notificationType, setNotificationType] = useState<AlertType>("GENERAL");
  const [allRawUsers, setAllRawUsers] = useState<any[]>([]);
  const [potSort, setPotSort] = useState<"none" | "desc" | "asc">("none");


  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getUserStatistics();
        console.log('User statistics:', data);
        setTotalUsers(data.totalUsers);
        setHighRiskUsers(data.highRiskUsers);
        setActiveUsers(data.activeUsersLastWeek);
        setAverageDiagnoses(data.avgDiagnosisCount);
      }
      catch (error) {
      }
    };
    fetchStatistics();
  }, [])

  useEffect(() => {
    const fetchAllUsers = async () => {
      setComponentLoading(true);
      try {
        const data = await getUsers({ page: 0, size: 10000 });

        setAllRawUsers(data.content);
      } catch (error) {
        console.error("전체 유저 목록 불러오기 실패:", error);
      } finally {
        setComponentLoading(false);
      }
    };
    fetchAllUsers();
  }, []);
          const riskMap: Record<string, 'low' | 'medium' | 'high'> = {
            LOW: 'low',
            MID: 'medium',
            HIGH: 'high'
          };

          useEffect(() => {
            const processUsers = async () => {
              if (allRawUsers.length === 0) return;
          
              setComponentLoading(true);
              try {
                let filtered = allRawUsers.filter((u: any) => {
                  const matchesSearch =
                    (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
          
                  const matchesDepression =
                    depressionFilter === "all" ||
                    (riskMap[u.depressionRisk] ?? "low") === depressionFilter;
          
                  const matchesGambling =
                    gamblingFilter === "all" ||
                    (riskMap[u.gamblingRisk] ?? "low") === gamblingFilter;
          
                  return matchesSearch && matchesDepression && matchesGambling;
                });
  
                if (potSort !== "none") {
                  filtered = [...filtered].sort((a: any, b: any) => {
                    const aPot = a.potLevel ?? 0;
                    const bPot = b.potLevel ?? 0;
                    return potSort === "desc" ? bPot - aPot : aPot - bPot;
                  });
                }
          
                setTotalPages(Math.ceil(filtered.length / itemsPerPage));
          
                const startIndex = (currentPage - 1) * itemsPerPage;
                const slicedUsers = filtered.slice(startIndex, startIndex + itemsPerPage);
          
                const mapped: MappedUser[] = slicedUsers.map((u: any) => ({
                  id: u.id,
                  name: u.name,
                  age: new Date().getFullYear() - new Date(u.birthDate).getFullYear(),
                  gender: u.gender,
                  email: u.email,
                  depressionStatus: riskMap[u.depressionRisk] ?? "low",
                  gamblingStatus: riskMap[u.gamblingRisk] ?? "low",
                  potLevel: u.potLevel ?? 0,
                  lastDiagnosis: u.updatedAt
                    ? new Date(u.updatedAt).toISOString().split("T")[0]
                    : "-",
                  diagnosisCount: u.totalAssessments ?? 0,
                  improvementRate: ((u.improvementRate ?? 0).toFixed(2)) + "%",
                  registrationDate: u.createdAt,
                  lastActive: u.updatedAt || "-",
                }));
          
                setUsers(mapped);
              } catch (error) {
                console.error("데이터 처리 중 오류:", error);
              } finally {
                setComponentLoading(false);
              }
            };
          
            const timer = setTimeout(processUsers, 300);
            return () => clearTimeout(timer);
          }, [
            allRawUsers,
            searchTerm,
            depressionFilter,
            gamblingFilter,
            potSort, 
            currentPage,
          ]);
          
  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, depressionFilter, gamblingFilter, potSort]);


  const getStatusBadge = (status: string, type: 'depression' | 'gambling') => {
    const baseClasses = "text-xs";
    switch (status) {
      case 'low':
        return <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800`}>{'안정'}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{'주의'}</Badge>;
      case 'high':
        return <Badge variant="destructive" className={baseClasses}>{'위험'}</Badge>;
      default:
        return <Badge variant="outline" className={baseClasses}>알 수 없음</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (user.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesDepression = depressionFilter === 'all' || user.depressionStatus === depressionFilter;
    const matchesGambling = gamblingFilter === 'all' || user.gamblingStatus === gamblingFilter;
    return matchesSearch && matchesDepression && matchesGambling;
  });
  

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const selectHighRiskUsers = () => {
    const highRisk = users.filter(u => u.depressionStatus === 'high' || u.gamblingStatus === 'high').map(u => u.id);
    setSelectedUsers(highRisk);
  };

  const getImprovementColor = (rate: string) => rate.startsWith('+') ? 'text-green-600' : 'text-red-600';

  const handleSendNotification = async () => {
    if (selectedUsers.length === 0) return;
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      alert("제목과 메시지를 모두 입력해주세요.");
      return;
    }

    if (!confirm(`${selectedUsers.length}명에게 알림을 발송하시겠습니까?`)) return;

    setIsSending(true);

    try {
      await sendBulkAlert({
        userIds: selectedUsers,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
      });

      alert("성공적으로 알림이 발송되었습니다.");

      setIsNotificationOpen(false);
      setNotificationMessage("");
      setNotificationTitle("");
      setNotificationType("GENERAL");
      setSelectedUsers([]);

    } catch (error: any) {
      console.error("알림 발송 실패:", error);
      alert(error.message || "알림 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleUserClick = async (user: MappedUser) => {
    setSelectedUser(user);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 joyride-user-summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">전체 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {totalUsers}
              </div>
              <p className="text-sm text-muted-foreground">등록된 사용자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">활성 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-green-600">
                {activeUsers}
              </div>
              <p className="text-sm text-muted-foreground">최근 1주일</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">고위험군</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-600">
                {highRiskUsers}
              </div>
              <p className="text-sm text-muted-foreground">우울/도박 고위험</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">평균 진단 횟수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {averageDiagnoses}
              </div>
              <p className="text-sm text-muted-foreground">사용자당</p>
            </CardContent>
          </Card>
        </div>
        <Card className="joyride-user-table">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>사용자 목록</CardTitle>
                <div className="flex gap-2">
                  <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="gap-2 joyride-user-notification"
                        disabled={selectedUsers.length === 0}
                      >
                        <Bell className="h-4 w-4" />
                        알림 발송 ({selectedUsers.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>사용자 알림 발송</DialogTitle>
                        <DialogDescription>
                          선택한 사용자들에게 알림 메시지를 발송합니다.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">알림 유형</label>
                          <Select
                            value={notificationType}
                            onValueChange={(value: AlertType) => setNotificationType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GENERAL">일반 알림</SelectItem>
                              <SelectItem value="SYSTEM">시스템 공지</SelectItem>
                              <SelectItem value="URGENT">긴급 알림</SelectItem>
                              <SelectItem value="ASSESSMENT">검사 관련</SelectItem>
                              <SelectItem value="ACHIEVEMENT">업적/달성</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">제목</label>
                          <Input
                            placeholder="알림 제목"
                            value={notificationTitle}
                            onChange={(e) => setNotificationTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">내용</label>
                          <Textarea
                            placeholder="내용을 입력하세요"
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <Button onClick={handleSendNotification} disabled={isSending}>
                          {isSending ? "발송 중..." : "전송하기"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col gap-1 flex-1 joyride-user-search">
                    <span className="text-xs text-muted-foreground">사용자 검색</span>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        placeholder="사용자 ID, 이메일, 이름"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-40 joyride-user-pot-filter">
                <span className="text-xs text-muted-foreground">레벨</span>
                <Select value={potSort} onValueChange={(v) => setPotSort(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">정렬</SelectItem>
                    <SelectItem value="desc">높은 순</SelectItem>
                    <SelectItem value="asc">낮은 순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div className="flex flex-col gap-1 w-40 joyride-user-depression-filter">
                  <span className="text-xs text-muted-foreground">우울증 위험도</span>
                  <Select value={depressionFilter} onValueChange={setDepressionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="low">안정</SelectItem>
                      <SelectItem value="medium">주의</SelectItem>
                      <SelectItem value="high">위험</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 w-40 joyride-user-gambling-filter">
                  <span className="text-xs text-muted-foreground">도박 위험도</span>
                  <Select value={gamblingFilter} onValueChange={setGamblingFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">중간</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>
          </CardHeader>
          {
            componentLoading ? (
              <LoadingSpinner />
            ) : (<CardContent className="overflow-auto">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  일치하는 사용자가 없습니다.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded cursor-pointer"
                        />
                    </TableHead>
                    <TableHead className="text-center">사용자 ID</TableHead>
                    <TableHead className="text-center">이메일</TableHead>
                    <TableHead className="text-center">이름</TableHead>
                    <TableHead className="text-center">나이</TableHead>
                    <TableHead className="text-center">성별</TableHead>
                    <TableHead className="text-center">레벨</TableHead> 
                    <TableHead className="text-center">우울증 위험도</TableHead>
                    <TableHead className="text-center">도박 위험도</TableHead>
                    <TableHead className="text-center">최근 진단일</TableHead>
                    <TableHead className="text-center">개선율</TableHead>
                    <TableHead className="text-center">진단 횟수</TableHead>
                    <TableHead className="text-center">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-center">{user.id.length > 10 ? `${user.id.substring(0, 10)}...` : user.id}</TableCell>
                      <TableCell className="text-sm text-center">{user.email}</TableCell>
                      <TableCell className="text-center">{user.name}</TableCell>
                      <TableCell className="text-center">{user.age}세</TableCell>
                      <TableCell className="text-center">{user.gender}</TableCell>
                      <TableCell className="text-center">🌸 {user.potLevel.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(user.depressionStatus, 'depression')}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(user.gamblingStatus, 'gambling')}</TableCell>
                      <TableCell className="text-center">{user.lastDiagnosis}</TableCell>
                      <TableCell className={`text-center ${getImprovementColor(user.improvementRate)}`}>{user.improvementRate}</TableCell>
                      <TableCell className="text-center">{user.diagnosisCount}회</TableCell>
                      <TableCell className="text-center joyride-user-detail">
                        <Button variant="ghost" size="sm" onClick={() => handleUserClick(user)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
              </CardContent>
            )}
              
              {totalPages > 1 && (
                <div className="flex justify-end items-center px-6 pb-6 gap-2 bg-background">
                  <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    이전
                  </Button>
              
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
              
                  <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    다음
                  </Button>
                </div>
              )}

        </Card>
      </div>

      <div className="lg:sticky lg:top-6 lg:h-fit">
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>사용자 상세 정보</CardTitle>

              {selectedUser && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="joyride-user-info-detail">
                      정보 더보기
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>기본 정보</DialogTitle>
                    </DialogHeader>

                    <UserBasicInfo userId={selectedUser.id} />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>

          <CardContent>
            {selectedUser ? (
              <UserDetail userId={selectedUser.id} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">사용자를 선택하세요</h3>
                <p className="text-sm text-muted-foreground">
                  왼쪽 목록에서 사용자를 클릭하면<br />
                  상세 정보를 확인할 수 있습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <UserManagementJoyride
        handleUserClick={handleUserClick}
        users={users}
      />
    </div>
  );
}