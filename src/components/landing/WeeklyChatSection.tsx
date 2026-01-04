import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function WeeklyChatSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    10
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">
                    <span className="mr-2">💬</span>
                    매일 1주제
                </h2>
            </div>

            <Card className="border-2 shadow-lg max-w-4xl mx-auto">
                <CardContent className="p-12">
                    <div className="grid md:grid-cols-2 gap-14 lg:gap-14">
                        {/* Left side - Chat interface screenshot */}
                        <div className="flex justify-center">
                            <img
                                src="/images/weeklychat.png"
                                alt="매일 1주제 채팅 화면"
                                className="max-w-sm md:max-w-md h-auto object-contain"
                            />
                        </div>

                        {/* Right side - Content */}
                        <div className="flex flex-col justify-center space-y-4">
                            <div>
                                <h3 className="text-xl font-bold mb-4">
                                    가벼운 일상 대화
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    하루에 하나의 질문을 통해 생각과 감정을
                                    돌아보는 기능입니다. 부담 없이 챗봇과의
                                    대화를 통해 자신의 상태를 돌아보는 습관을
                                    만들어보세요.
                                </p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6">
                                <h4 className="font-bold mb-3">사용 팁</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>
                                            정해진 형식이 없어 편하게 작성
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>매일 다른 주제로 대화 시작</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>
                                            답변은 저장되어 나중에 확인 가능
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
