import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function CalendarSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    07
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">캘린더</h2>
            </div>

            <Card className="border-2 shadow-lg max-w-5xl mx-auto">
                <CardContent className="p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left side - Screenshot */}
                        <div className="flex justify-center order-2 md:order-1">
                            <img
                                src="/images/calendar.png"
                                alt="캘린더 화면"
                                className="max-w-[200px] h-auto"
                            />
                        </div>

                        {/* Right side - Content */}
                        <div className="space-y-6 order-1 md:order-2">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">
                                    날짜별 활동 기록 확인
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    우측 상단의 날짜별 버튼을 눌러 캘린더
                                    화면으로 이동하세요. 날짜별로 활동 내역을
                                    한눈에 볼 수 있습니다.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                진단 기록
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                PHQ-9, GAD-7, CAGI 진단 결과
                                                날짜 표시
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                일기 & 퀘스트
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                작성한 일기와 완성한 퀘스트 확인
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-blue-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                활동 추적
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                날짜별로 나의 활동 패턴 파악
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
