import { useState } from "react";
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

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  depressionStatus: 'low' | 'medium' | 'high';
  gamblingStatus: 'low' | 'medium' | 'high';
  lastActive: string;
  registrationDate: string;
  diagnosisCount: number;
  lastDiagnosis: string;
  improvementRate: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [depressionFilter, setDepressionFilter] = useState("all");
  const [gamblingFilter, setGamblingFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const users: User[] = [
    {
      id: 'USR001',
      name: '김민준',
      age: 16,
      gender: '남',
      email: 'kmj2008@email.com',
      depressionStatus: 'low',
      gamblingStatus: 'medium',
      lastActive: '2024-10-05',
      registrationDate: '2024-08-15',
      diagnosisCount: 8,
      lastDiagnosis: '2024-10-05',
      improvementRate: '+15%'
    },
    {
      id: 'USR002',
      name: '이서연',
      age: 17,
      gender: '여',
      email: 'lsy2007@email.com',
      depressionStatus: 'high',
      gamblingStatus: 'high',
      lastActive: '2024-10-04',
      registrationDate: '2024-07-22',
      diagnosisCount: 12,
      lastDiagnosis: '2024-10-04',
      improvementRate: '-8%'
    },
    {
      id: 'USR003',
      name: '박준호',
      age: 15,
      gender: '남',
      email: 'pjh2009@email.com',
      depressionStatus: 'medium',
      gamblingStatus: 'low',
      lastActive: '2024-10-03',
      registrationDate: '2024-09-01',
      diagnosisCount: 5,
      lastDiagnosis: '2024-10-03',
      improvementRate: '+22%'
    },
    {
      id: 'USR004',
      name: '정수빈',
      age: 18,
      gender: '여',
      email: 'jsb2006@email.com',
      depressionStatus: 'low',
      gamblingStatus: 'low',
      lastActive: '2024-10-02',
      registrationDate: '2024-06-10',
      diagnosisCount: 15,
      lastDiagnosis: '2024-10-02',
      improvementRate: '+30%'
    },
    {
      id: 'USR005',
      name: '최하은',
      age: 16,
      gender: '여',
      email: 'che2008@email.com',
      depressionStatus: 'medium',
      gamblingStatus: 'medium',
      lastActive: '2024-10-01',
      registrationDate: '2024-08-28',
      diagnosisCount: 7,
      lastDiagnosis: '2024-10-01',
      improvementRate: '+12%'
    },
    {
      id: 'USR006',
      name: '한지우',
      age: 17,
      gender: '남',
      email: 'hjw2007@email.com',
      depressionStatus: 'high',
      gamblingStatus: 'low',
      lastActive: '2024-09-30',
      registrationDate: '2024-07-05',
      diagnosisCount: 9,
      lastDiagnosis: '2024-09-30',
      improvementRate: '-3%'
    }
  ];

  const getStatusBadge = (status: string, type: 'depression' | 'gambling') => {
    const baseClasses = "text-xs";
    switch (status) {
      case 'low':
        return (
          <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800`}>
            {type === 'depression' ? '안정' : '낮음'}
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {type === 'depression' ? '주의' : '중간'}
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="destructive" className={baseClasses}>
            {type === 'depression' ? '위험' : '높음'}
          </Badge>
        );
      default:
        return <Badge variant="outline" className={baseClasses}>알 수 없음</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepression = depressionFilter === "all" || user.depressionStatus === depressionFilter;
    const matchesGambling = gamblingFilter === "all" || user.gamblingStatus === gamblingFilter;
    
    return matchesSearch && matchesDepression && matchesGambling;
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendNotification = () => {
    // 실제로는 API 호출이 이루어질 것입니다
    console.log('알림 발송:', {
      users: selectedUsers,
      message: notificationMessage
    });
    setIsNotificationOpen(false);
    setNotificationMessage("");
    setSelectedUsers([]);
    alert(`${selectedUsers.length}명의 사용자에게 알림이 발송되었습니다.`);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectHighRiskUsers = () => {
    const highRiskUsers = users
      .filter(user => user.depressionStatus === 'high' || user.gamblingStatus === 'high')
      .map(user => user.id);
    setSelectedUsers(highRiskUsers);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getImprovementColor = (rate: string) => {
    const isPositive = rate.startsWith('+');
    return isPositive ? 'text-green-600' : 'text-red-600';
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
              <div className="text-2xl font-semibold">{users.length}</div>
              <p className="text-sm text-muted-foreground">등록된 사용자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">고위험군</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-600">
                {users.filter(u => u.depressionStatus === 'high' || u.gamblingStatus === 'high').length}
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
                {users.filter(u => new Date(u.lastActive) > new Date('2024-10-01')).length}
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
                {Math.round(users.reduce((sum, u) => sum + u.diagnosisCount, 0) / users.length)}
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
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded cursor-pointer"
                    />
                  </TableHead>
                  <TableHead>사용자 ID</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>나이</TableHead>
                  <TableHead>성별</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>우울증</TableHead>
                  <TableHead>도박 위험도</TableHead>
                  <TableHead>최근 진단일</TableHead>
                  <TableHead>개선율</TableHead>
                  <TableHead>진단 횟수</TableHead>
                  <TableHead>상세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.age}세</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user.depressionStatus, 'depression')}</TableCell>
                    <TableCell>{getStatusBadge(user.gamblingStatus, 'gambling')}</TableCell>
                    <TableCell>{user.lastDiagnosis}</TableCell>
                    <TableCell className={getImprovementColor(user.improvementRate)}>
                      {user.improvementRate}
                    </TableCell>
                    <TableCell>{user.diagnosisCount}회</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserClick(user)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <UserDetail user={selectedUser} />
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