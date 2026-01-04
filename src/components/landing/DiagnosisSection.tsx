import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function DiagnosisSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    11
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">마음 건강 진단</h2>
            </div>

            <Card className="border-2 shadow-lg max-w-4xl mx-auto">
                <CardContent className="p-12">
                    <div className="text-center mb-12">
                        <p className="text-xl text-gray-700">
                            정식 우울 진단(PHQ-9, GAD-7)과 도박 중독
                            진단(CPGI)을 통해
                            <br />
                            현재 나의 상태를 객관적으로 파악하고, 변화 추이를
                            확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <img
                            src="/images/diagnosis.png"
                            alt="마음 건강 진단 화면"
                            className="max-w-md h-auto object-contain"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="border-2 border-purple-200 bg-purple-50">
                            <CardContent className="pt-6 text-center">
                                <h4 className="font-bold text-lg mb-2">
                                    PHQ-9
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    우울증 선별 검사
                                </p>
                                <p className="text-xs text-gray-500">
                                    9개 문항으로 우울 정도 평가
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardContent className="pt-6 text-center">
                                <h4 className="font-bold text-lg mb-2">
                                    GAD-7
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    범불안장애 선별 검사
                                </p>
                                <p className="text-xs text-gray-500">
                                    7개 문장으로 불안 정도를 평가
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-pink-200 bg-pink-50">
                            <CardContent className="pt-6 text-center">
                                <h4 className="font-bold text-lg mb-2">CPGI</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    도박 문제 선별 검사
                                </p>
                                <p className="text-xs text-gray-500">
                                    도박 중독 위험도를 평가
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                        <h4 className="font-bold mb-3 text-red-800 flex items-center gap-2">
                            <span>📊</span>
                            결과 확인 및 추이 분석
                        </h4>
                        <p className="text-sm text-gray-700">
                            진단 완료 후 즉시 결과를 확인할 수 있으며,
                            캘린더에서 과거 진단 기록과 비교하여 나의 변화
                            추이를 그래프로 확인할 수 있습니다.
                        </p>
                        <p className="text-xs text-red-600 mt-3">
                            ○ 정기적인 진단을 통해 상태 변화를 모니터링하고,
                            필요시 전문가 상담을 권장합니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
