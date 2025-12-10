import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Calendar, Download, Filter, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import React from "react";

export function DiagnosisResults() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const improvementData = [
    { month: '1월', low: 65, medium: 25, high: 10 },
    { month: '2월', low: 68, medium: 23, high: 9 },
    { month: '3월', low: 72, medium: 20, high: 8 },
    { month: '4월', low: 75, medium: 18, high: 7 },
    { month: '5월', low: 78, medium: 16, high: 6 },
    { month: '6월', low: 82, medium: 13, high: 5 },
  ];

  const diagnosisData = [
    {
      id: 'USR001',
      name: '김**',
      age: 16,
      lastDiagnosis: '2024-10-05',
      currentStatus: 'low',
      improvementRate: '+25%',
      diagnosisCount: 8
    },
    {
      id: 'USR002',
      name: '이**',
      age: 17,
      lastDiagnosis: '2024-10-04',
      currentStatus: 'medium',
      improvementRate: '+10%',
      diagnosisCount: 5
    },
    {
      id: 'USR003',
      name: '박**',
      age: 15,
      lastDiagnosis: '2024-10-03',
      currentStatus: 'high',
      improvementRate: '-5%',
      diagnosisCount: 12
    },
    {
      id: 'USR004',
      name: '정**',
      age: 18,
      lastDiagnosis: '2024-10-02',
      currentStatus: 'low',
      improvementRate: '+35%',
      diagnosisCount: 6
    },
    {
      id: 'USR005',
      name: '최**',
      age: 16,
      lastDiagnosis: '2024-10-01',
      currentStatus: 'medium',
      improvementRate: '+15%',
      diagnosisCount: 9
    }
  ];

  // 설문 응답 데이터 (예시)
  const surveyResponses: Record<string, any> = {
    'USR001': {
      phq9: {
        questions: [
          { q: '일상 활동에 대한 흥미나 즐거움이 거의 없음', answer: '전혀 그렇지 않다', score: 0 },
          { q: '기분이 가라앉거나 우울하거나 희망이 없음', answer: '며칠 동안', score: 1 },
          { q: '잠들기 어렵거나 자주 깨거나 너무 많이 잠', answer: '전혀 그렇지 않다', score: 0 },
          { q: '피곤하거나 기운이 거의 없음', answer: '며칠 동안', score: 1 },
          { q: '식욕이 없거나 과식함', answer: '전혀 그렇지 않다', score: 0 },
          { q: '자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴', answer: '전혀 그렇지 않다', score: 0 },
          { q: '신문을 읽거나 TV를 보는 것 같은 일에 집중하기 어려움', answer: '며칠 동안', score: 1 },
          { q: '다른 사람들이 알아챌 정도로 느리게 움직이거나 반대로 너무 안절부절 못함', answer: '전혀 그렇지 않다', score: 0 },
          { q: '자신을 해치거나 죽는 것이 더 낫다는 생각', answer: '전혀 그렇지 않다', score: 0 },
        ],
        totalScore: 3
      },
      gad7: {
        questions: [
          { q: '초조하거나 불안하거나 조마조마하게 느낌', answer: '전혀 그렇지 않다', score: 0 },
          { q: '걱정하는 것을 멈추거나 조절할 수 없음', answer: '며칠 동안', score: 1 },
          { q: '여러 가지 것들에 대해 걱정을 너무 많이 함', answer: '전혀 그렇지 않다', score: 0 },
          { q: '편하게 있기가 어려움', answer: '며칠 동안', score: 1 },
          { q: '너무 안절부절 못해서 가만히 있기 힘듦', answer: '전혀 그렇지 않다', score: 0 },
          { q: '쉽게 짜증이 나거나 쉽게 성을 냄', answer: '전혀 그렇지 않다', score: 0 },
          { q: '무언가 끔찍한 일이 일어날 것 같아 두려움', answer: '전혀 그렇지 않다', score: 0 },
        ],
        totalScore: 2
      },
      cpgi: {
        questions: [
          { q: '도박으로 잃은 것보다 더 많은 돈을 걸었습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '같은 흥분을 느끼기 위해 점점 더 많은 돈이 필요했습니까?', answer: '가끔', score: 1 },
          { q: '잃은 돈을 따기 위해 다른 날 다시 갔습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박 자금을 마련하기 위해 돈을 빌리거나 물건을 팔았습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박 문제가 있을 수도 있다고 느낀 적이 있습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박으로 인해 건강 문제(스트레스나 불안 포함)가 생겼습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '사람들이 당신의 도박을 비난하거나 문제가 있다고 말했습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박으로 인해 자신이나 가족에게 재정적 문제가 발생했습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박 습관에 대해 죄책감을 느낀 적이 있습니까?', answer: '전혀 그렇지 않다', score: 0 },
        ],
        totalScore: 1
      }
    },
    'USR002': {
      phq9: {
        questions: [
          { q: '일상 활동에 대한 흥미나 즐거움이 거의 없음', answer: '일주일 이상', score: 2 },
          { q: '기분이 가라앉거나 우울하거나 희망이 없음', answer: '일주일 이상', score: 2 },
          { q: '잠들기 어렵거나 자주 깨거나 너무 많이 잠', answer: '며칠 동안', score: 1 },
          { q: '피곤하거나 기운이 거의 없음', answer: '일주일 이상', score: 2 },
          { q: '식욕이 없거나 과식함', answer: '며칠 동안', score: 1 },
          { q: '자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴', answer: '며칠 동안', score: 1 },
          { q: '신문을 읽거나 TV를 보는 것 같은 일에 집중하기 어려움', answer: '며칠 동안', score: 1 },
          { q: '다른 사람들이 알아챌 정도로 느리게 움직이거나 반대로 너무 안절부절 못함', answer: '전혀 그렇지 않다', score: 0 },
          { q: '자신을 해치거나 죽는 것이 더 낫다는 생각', answer: '전혀 그렇지 않다', score: 0 },
        ],
        totalScore: 10
      },
      gad7: {
        questions: [
          { q: '초조하거나 불안하거나 조마조마하게 느낌', answer: '일주일 이상', score: 2 },
          { q: '걱정하는 것을 멈추거나 조절할 수 없음', answer: '며칠 동안', score: 1 },
          { q: '여러 가지 것들에 대해 걱정을 너무 많이 함', answer: '일주일 이상', score: 2 },
          { q: '편하게 있기가 어려움', answer: '며칠 동안', score: 1 },
          { q: '너무 안절부절 못해서 가만히 있기 힘듦', answer: '며칠 동안', score: 1 },
          { q: '쉽게 짜증이 나거나 쉽게 성을 냄', answer: '며칠 동안', score: 1 },
          { q: '무언가 끔찍한 일이 일어날 것 같아 두려움', answer: '며칠 동안', score: 1 },
        ],
        totalScore: 9
      },
      cpgi: {
        questions: [
          { q: '도박으로 잃은 것보다 더 많은 돈을 걸었습니까?', answer: '가끔', score: 1 },
          { q: '같은 흥분을 느끼기 위해 점점 더 많은 돈이 필요했습니까?', answer: '대부분', score: 2 },
          { q: '잃은 돈을 따기 위해 다른 날 다시 갔습니까?', answer: '가끔', score: 1 },
          { q: '도박 자금을 마련하기 위해 돈을 빌리거나 물건을 팔았습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박 문제가 있을 수도 있다고 느낀 적이 있습니까?', answer: '가끔', score: 1 },
          { q: '도박으로 인해 건강 문제(스트레스나 불안 포함)가 생겼습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '사람들이 당신의 도박을 비난하거나 문제가 있다고 말했습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박으로 인해 자신이나 가족에게 재정적 문제가 발생했습니까?', answer: '전혀 그렇지 않다', score: 0 },
          { q: '도박 습관에 대해 죄책감을 느낀 적이 있습니까?', answer: '가끔', score: 1 },
        ],
        totalScore: 6
      }
    },
    'USR003': {
      phq9: {
        questions: [
          { q: '일상 활동에 대한 흥미나 즐거움이 거의 없음', answer: '거의 매일', score: 3 },
          { q: '기분이 가라앉거나 우울하거나 희망이 없음', answer: '거의 매일', score: 3 },
          { q: '잠들기 어렵거나 자주 깨거나 너무 많이 잠', answer: '일주일 이상', score: 2 },
          { q: '피곤하거나 기운이 거의 없음', answer: '거의 매일', score: 3 },
          { q: '식욕이 없거나 과식함', answer: '일주일 이상', score: 2 },
          { q: '자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴', answer: '일주일 이상', score: 2 },
          { q: '신문을 읽거나 TV를 보는 것 같은 일에 집중하기 어려움', answer: '거의 매일', score: 3 },
          { q: '다른 사람들이 알아챌 정도로 느리게 움직이거나 반대로 너무 안절부절 못함', answer: '며칠 동안', score: 1 },
          { q: '자신을 해치거나 죽는 것이 더 낫다는 생각', answer: '며칠 동안', score: 1 },
        ],
        totalScore: 20
      },
      gad7: {
        questions: [
          { q: '초조하거나 불안하거나 조마조마하게 느낌', answer: '거의 매일', score: 3 },
          { q: '걱정하는 것을 멈추거나 조절할 수 없음', answer: '거의 매일', score: 3 },
          { q: '여러 가지 것들에 대해 걱정을 너무 많이 함', answer: '거의 매일', score: 3 },
          { q: '편하게 있기가 어려움', answer: '일주일 이상', score: 2 },
          { q: '너무 안절부절 못해서 가만히 있기 힘듦', answer: '일주일 이상', score: 2 },
          { q: '쉽게 짜증이 나거나 쉽게 성을 냄', answer: '일주일 이상', score: 2 },
          { q: '무언가 끔찍한 일이 일어날 것 같아 두려움', answer: '거의 매일', score: 3 },
        ],
        totalScore: 18
      },
      cpgi: {
        questions: [
          { q: '도박으로 잃은 것보다 더 많은 돈을 걸었습니까?', answer: '대부분', score: 2 },
          { q: '같은 흥분을 느끼기 위해 점점 더 많은 돈이 필요했습니까?', answer: '거의 항상', score: 3 },
          { q: '잃은 돈을 따기 위해 다른 날 다시 갔습니까?', answer: '대부분', score: 2 },
          { q: '도박 자금을 마련하기 위해 돈을 빌리거나 물건을 팔았습니까?', answer: '가끔', score: 1 },
          { q: '도박 문제가 있을 수도 있다고 느낀 적이 있습니까?', answer: '대부분', score: 2 },
          { q: '도박으로 인해 건강 문제(스트레스나 불안 포함)가 생겼습니까?', answer: '가끔', score: 1 },
          { q: '사람들이 당신의 도박을 비난하거나 문제가 있다고 말했습니까?', answer: '대부분', score: 2 },
          { q: '도박으로 인해 자신이나 가족에게 재정적 문제가 발생했습니까?', answer: '가끔', score: 1 },
          { q: '도박 습관에 대해 죄책감을 느낀 적이 있습니까?', answer: '대부분', score: 2 },
        ],
        totalScore: 16
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'low':
        return <Badge variant="default" className="bg-green-100 text-green-800">안정</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'high':
        return <Badge variant="destructive">위험</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getImprovementColor = (rate: string) => {
    const isPositive = rate.startsWith('+');
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 필터 및 컨트롤 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>진단 결과 분석</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="3months">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                필터
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 상태별 분포 추이 */}
      <Card>
        <CardHeader>
          <CardTitle>위험도별 사용자 분포 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Area 
                type="monotone" 
                dataKey="low" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981"
                name="안정군"
              />
              <Area 
                type="monotone" 
                dataKey="medium" 
                stackId="1" 
                stroke="#f59e0b" 
                fill="#f59e0b"
                name="주의군"
              />
              <Area 
                type="monotone" 
                dataKey="high" 
                stackId="1" 
                stroke="#ef4444" 
                fill="#ef4444"
                name="위험군"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">전체 개선율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">+18.2%</div>
            <p className="text-sm text-muted-foreground">최근 3개월</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">안정군 비율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">82%</div>
            <p className="text-sm text-muted-foreground">현재 기준</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">총 진단 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">15,347</div>
            <p className="text-sm text-muted-foreground">최근 3개월</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">평균 진단 간격</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12일</div>
            <p className="text-sm text-muted-foreground">사용자당</p>
          </CardContent>
        </Card>
      </div>

      {/* 사용자별 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>최근에 설문을 실시한 사용자 진단 결과</CardTitle>
          <p className="text-sm text-muted-foreground">최근 7일 이내 설문 완료 사용자</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>연령</TableHead>
                <TableHead>최근 진단일</TableHead>
                <TableHead>현재 상태</TableHead>
                <TableHead>개선율</TableHead>
                <TableHead>총 진단 횟수</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnosisData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.age}세</TableCell>
                  <TableCell>{user.lastDiagnosis}</TableCell>
                  <TableCell>{getStatusBadge(user.currentStatus)}</TableCell>
                  <TableCell className={getImprovementColor(user.improvementRate)}>
                    {user.improvementRate}
                  </TableCell>
                  <TableCell>{user.diagnosisCount}회</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <FileText className="h-4 w-4" />
                          설문 내용
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>설문 응답 상세 - {user.name} ({user.id})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
                          {/* PHQ-9 우울증 검사 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">PHQ-9 우울증 검사</h3>
                              <Badge variant="outline">
                                총점: {surveyResponses[user.id]?.phq9?.totalScore || 0}/27
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {surveyResponses[user.id]?.phq9?.questions.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm mb-1">{idx + 1}. {item.q}</p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-primary">답변: {item.answer}</p>
                                    <span className="text-xs text-muted-foreground">점수: {item.score}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* GAD-7 불안 검사 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">GAD-7 불안 검사</h3>
                              <Badge variant="outline">
                                총점: {surveyResponses[user.id]?.gad7?.totalScore || 0}/21
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {surveyResponses[user.id]?.gad7?.questions.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm mb-1">{idx + 1}. {item.q}</p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-primary">답변: {item.answer}</p>
                                    <span className="text-xs text-muted-foreground">점수: {item.score}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CPGI 도박 중독 검사 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">CPGI 도박 중독 검사</h3>
                              <Badge variant="outline">
                                총점: {surveyResponses[user.id]?.cpgi?.totalScore || 0}/27
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {surveyResponses[user.id]?.cpgi?.questions.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm mb-1">{idx + 1}. {item.q}</p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-primary">답변: {item.answer}</p>
                                    <span className="text-xs text-muted-foreground">점수: {item.score}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}