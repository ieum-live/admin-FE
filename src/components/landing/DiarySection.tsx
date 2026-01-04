import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function DiarySection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    08
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">일기 작성하기</h2>
            </div>

            <Card className="border-2 shadow-lg max-w-5xl mx-auto">
                <CardContent className="p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">
                                    감정 기록과 AI 피드백
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    하루 동안 느낀 감정과 생각을 자유롭게
                                    기록하고, 럭키비키 AI의 따뜻한 피드백을
                                    받아보세요.
                                </p>

                                <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                                    <div className="pb-3 border-b border-gray-200">
                                        <h4 className="font-bold mb-2">
                                            1. 일기 작성
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            간단한 기록만으로도 저장 가능합니다.
                                            길게 쓰지 않아도 괜찮아요.
                                        </p>
                                    </div>

                                    <div className="pb-3 border-b border-gray-200">
                                        <h4 className="font-bold mb-2">
                                            2. AI 코멘트
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            럭키비키 AI가 감정적 공감과 위로,
                                            조언을 전해줍니다.
                                        </p>
                                    </div>

                                    <div className="pb-3 border-b border-gray-200">
                                        <h4 className="font-bold mb-2">
                                            3. 피드백 받기
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            AI 피드백을 받고 나서 생각을 남길 수
                                            있습니다.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold mb-2">
                                            4. 캘린더 확인
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            작성한 일기는 캘린더에서 날짜별로
                                            다시 확인할 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Screenshot */}
                        <div className="flex justify-center">
                            <img
                                src="/images/diary.png"
                                alt="일기 작성 화면"
                                className="max-w-md h-auto"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
