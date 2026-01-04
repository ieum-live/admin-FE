import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Sprout } from "lucide-react";

export function StartSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-8">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    04
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">시작하기</h2>
            </div>

            <Card className="border-2 shadow-lg max-w-4xl mx-auto">
                <CardContent className="py-12 px-8">
                    <div className="text-center mb-8">
                        <p className="text-sm font-semibold text-gray-500 mb-2">
                            스토리 기반 약식 검사
                        </p>
                        <p className="text-lg text-gray-600 mb-6">
                            시뮬레이션 게임 구조의 회원가입으로 보다 재미있게!
                        </p>
                        <div className="flex justify-center mb-12">
                            <img
                                src="/images/start.png"
                                alt="시작하기 가이드 이미지"
                                className="w-full max-w-md h-auto"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8 mb-8">
                        <p className="text-xl font-bold text-center mb-6">
                            "우리 어디서 본 적 있나?"
                        </p>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            세잎이의 질문에 사용자에게는 다음과 같은 선택지가
                            주어집니다.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-6 border-2 border-black">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-black text-white hover:bg-black">
                                        네
                                    </Badge>
                                </div>
                                <h4 className="font-bold mb-2">로그인</h4>
                                <p className="text-sm text-gray-600">
                                    기존 사용자로 인식하여 로그인 절차가
                                    진행됩니다
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge
                                        variant="outline"
                                        className="border-black text-black"
                                    >
                                        아니요
                                    </Badge>
                                </div>
                                <h4 className="font-bold mb-2">회원가입</h4>
                                <p className="text-sm text-gray-600">
                                    새로운 방문자로 설정되어 회원가입 스토리가
                                    시작됩니다
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <span className="text-lg">🎮</span>
                            시뮬레이션 게임 형태의 회원가입
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">○</span>
                                <span>
                                    스토리 속 실행에 따라 직접 질문에 답하고
                                    선택지를 고릅니다
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">○</span>
                                <span>
                                    검사 문항들이 아닌{" "}
                                    <strong>
                                        일상적인 대화와 상황 선택자들
                                    </strong>
                                    로 구성
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">○</span>
                                <span>
                                    부담 없이 재미있게 시작할 수 있는 온보딩
                                    경험
                                </span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
