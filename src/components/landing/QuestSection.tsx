import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function QuestSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    09
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">퀘스트 시스템</h2>
                <p className="text-lg text-gray-600">
                    매일 하나씩 작은 습관 만들기
                </p>
            </div>

            <Card className="border-2 shadow-lg max-w-4xl mx-auto">
                <CardContent className="p-12">
                    <div className="text-center mb-12">
                        <p className="text-xl mb-6">
                            무리한 목표가 아닌
                            <strong className="text-green-600">
                                {" "}
                                작은 행동을 반복
                            </strong>
                            하며 꾸준한 습관을 만듭니다.
                            <br />
                            1-1부터 1-7까지 완료하면 다음 바퀴로 넘어가며
                            성장감을 느낄 수 있습니다.
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <img
                            src="/images/quest.png"
                            alt="퀘스트 목록 화면"
                            className="w-full max-w-3xl h-auto"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-2xl">🧘</span>
                                    </div>
                                    <h4 className="font-bold text-lg">
                                        명상 퀘스트
                                    </h4>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>
                                        • 마음을 차분하게 하고 현재 상태에 집중
                                    </li>
                                    <li>• 화면 지시에 따라 진행</li>
                                    <li>• 자신의 감정과 상태 인식 연습</li>
                                    <li>• 완료 시 물 주기 쿠폰 획득</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-200 bg-green-50">
                            <CardContent className="pt-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-2xl">🏃</span>
                                    </div>
                                    <h4 className="font-bold text-lg">
                                        산책 퀘스트
                                    </h4>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• 신체 활동을 통한 기분 전환</li>
                                    <li>• 정해진 시간 동안 가볍게 산책</li>
                                    <li>• 주변 환경과 움직임에 집중</li>
                                    <li>• 완료 시 물 주기 쿠폰 획득</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-pink-200 bg-pink-50">
                            <CardContent className="pt-6">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <h4 className="font-bold text-lg">
                                        중독 조절 퀘스트
                                    </h4>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>
                                        • 순간적 충동 인식하고 선택 돌아보기
                                    </li>
                                    <li>• 질문과 선택지로 감정 정리</li>
                                    <li>• 행동 전후 결과 생각하며 조절</li>
                                    <li>• 일상 대응 방식 습득</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-10 bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold mb-4 text-center text-lg">
                            <span className="mr-2">💡</span>
                            퀘스트 완료 및 보상
                        </h4>
                        <p className="text-center text-gray-600">
                            하루의 퀘스트를 완료하면 물 주기 쿠폰을 획득할 수
                            있습니다. 보상은 마음 정원 성장에 사용되며, 사용자의
                            꾸준한 활동이 시각적으로 표현됩니다. 완료한 퀘스트는
                            캘린더에서 다시 확인할 수 있습니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
