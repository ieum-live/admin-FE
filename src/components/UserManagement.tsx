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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { getUserStatistics, getUserDetail, getUsers } from "../API/userManagementAPI";

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

interface MappedUser {
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
}

export function UserManagement({ setComponentLoading }: { setComponentLoading: (isLoading: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [depressionFilter, setDepressionFilter] = useState("all");
  const [gamblingFilter, setGamblingFilter] = useState("all");
  const [users, setUsers] = useState<MappedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<MappedUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [highRiskUsers, setHighRiskUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [averageDiagnoses, setAverageDiagnoses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 30;

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
    const loadUsers = async (page: number) => {
      setComponentLoading(true);
      try {
        const data = await getUsers({ page: page - 1, size: itemsPerPage });
        setTotalPages(Math.ceil(data.page.totalElements / itemsPerPage));
        const mapped = await Promise.all(
          data.content.map(async (u: any) => {
            const detail: FullUser = await getUserDetail(u.id);
            return {
              id: u.id,
              name: u.name,
              age: new Date().getFullYear() - new Date(u.birthDate).getFullYear(),
              gender: u.gender,
              email: u.email,
              depressionStatus: (detail.status.depression?.toLowerCase() ?? 'low') as 'low' | 'medium' | 'high',
              gamblingStatus: (detail.status.depression?.toLowerCase() ?? 'low') as 'low' | 'medium' | 'high',
              lastDiagnosis: detail.status.latestAssessmentDate,
              diagnosisCount: detail.status.totalAssessments,
              improvementRate: ((detail.status.improvementRate ?? 0).toFixed(2)) + '%',
              registrationDate: u.createdAt,
              lastActive: detail.status.latestAssessmentDate,
            };
          })
        );
        setUsers(mapped);
      } catch (error) {
        console.error("유저 목록 불러오기 실패:", error);
      } finally {
        setComponentLoading(false);
      }
    };
    loadUsers(currentPage);
  }, [setComponentLoading, currentPage]);

  const getStatusBadge = (status: string, type: 'depression' | 'gambling') => {
    const baseClasses = "text-xs";
    switch (status) {
      case 'low':
        return <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800`}>{type === 'depression' ? '안정' : '낮음'}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{type === 'depression' ? '주의' : '중간'}</Badge>;
      case 'high':
        return <Badge variant="destructive" className={baseClasses}>{type === 'depression' ? '위험' : '높음'}</Badge>;
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

  const handleSendNotification = () => {
    console.log('알림 발송:', { users: selectedUsers, message: notificationMessage });
    alert(`${selectedUsers.length}명의 사용자에게 알림이 발송되었습니다.`);
    setIsNotificationOpen(false);
    setNotificationMessage("");
    setSelectedUsers([]);
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
      {/* 왼쪽: 사용자 목록 */}
      <div className="space-y-6">
        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

        {/* 사용자 목록 */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>사용자 목록</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={selectHighRiskUsers}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    고위험군 선택
                  </Button>
                  <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="gap-2"
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
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {selectedUsers.length}명의 사용자에게 알림을 발송합니다.
                          </p>
                        </div>
                        <Textarea
                          placeholder="알림 메시지를 입력하세요..."
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSendNotification}
                            disabled={!notificationMessage.trim()}
                            className="gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            앱 알림 발송
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleSendNotification}
                            disabled={!notificationMessage.trim()}
                            className="gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            이메일 발송
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="사용자 검색 (이름, 이메일, ID)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={depressionFilter} onValueChange={setDepressionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="우울증 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="low">안정</SelectItem>
                    <SelectItem value="medium">주의</SelectItem>
                    <SelectItem value="high">위험</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={gamblingFilter} onValueChange={setGamblingFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="도박 위험도" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 위험도</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">중간</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-center">사용자 ID</TableHead>
                  <TableHead className="text-center">이름</TableHead>
                  <TableHead className="text-center">나이</TableHead>
                  <TableHead className="text-center">성별</TableHead>
                  <TableHead className="text-center">이메일</TableHead>
                  <TableHead className="text-center">우울증</TableHead>
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
                    <TableCell className="text-center">{user.name}</TableCell>
                    <TableCell className="text-center">{user.age}세</TableCell>
                    <TableCell className="text-center">{user.gender}</TableCell>
                    <TableCell className="text-sm text-center">{user.email}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(user.depressionStatus, 'depression')}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(user.gamblingStatus, 'gambling')}</TableCell>
                    <TableCell className="text-center">{user.lastDiagnosis}</TableCell>
                    <TableCell className={`text-center ${getImprovementColor(user.improvementRate)}`}>{user.improvementRate}</TableCell>
                    <TableCell className="text-center">{user.diagnosisCount}회</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleUserClick(user)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} size="default" />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        size="default"
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} size="default" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 오른쪽: 사용자 상세 정보 (항상 표시) */}
      <div className="lg:sticky lg:top-6 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle>사용자 상세 정보</CardTitle>
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
    </div>
  );
}