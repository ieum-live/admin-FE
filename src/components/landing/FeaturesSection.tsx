import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
    Activity,
    BarChart3,
    PartyPopper,
    Heart,
    MessageCircle,
    Phone,
} from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    05
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">주요 기능</h2>
                <p className="text-lg text-gray-600">
                    매일 사용하는 다양한 기능으로 나만의 회복 여정을
                    만들어가세요
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 마음 정원 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold">마음 정원</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 물 주기 쿠폰으로 토끼풀 정원 키우기</li>
                            <li>• 꽃송이 개수로 레벨 표시</li>
                            <li>• 연속 사용 시 보너스 요소 등장</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 일기 & AI 피드백 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                일기 & AI 피드백
                            </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 오늘의 감정과 생각 기록</li>
                            <li>• 럭키비키 버튼을 통한 긍정적 사고의 시작</li>
                            <li>• AI 맞춤형 답변 제공</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 퀘스트 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <PartyPopper className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold">퀘스트</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 명상, 산책, 충동 조절 퀘스트</li>
                            <li>• 매일 하나씩 작은 습관 만들기</li>
                            <li>• 단계별 진행과 보상 시스템</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 마음 건강 진단 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold">
                                마음 건강 진단
                            </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 정식 우울 진단(PHQ-9)</li>
                            <li>• 도박 중독 진단 (CPGI)</li>
                            <li>• 변화 추이 확인</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 매일 1주제 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold">매일 1주제</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 하루 하나의 주제로 대화</li>
                            <li>• 쉽고 가벼운 감정 표현</li>
                            <li>• 짧은 문장이나 한 단어도 OK</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 헬프콜 지도 */}
                <Card className="border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold">헬프콜 지도</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 주변 지원 기관 찾기</li>
                            <li>• 바로 전화 연결 기능</li>
                            <li>• 위급 상황 즉각 대응</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
