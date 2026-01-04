import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { MapPin, Phone } from "lucide-react";

export function HelplineSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    12
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">헬프콜 지도</h2>
            </div>

            <Card className="border-2 shadow-lg max-w-5xl mx-auto">
                <CardContent className="p-12">
                    <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm max-w-md">
                                <h3 className="text-2xl font-bold mb-4">
                                    <Phone className="inline w-6 h-6 mr-2" />
                                    위급 상황, 즉각 도움 요청
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    도움이 필요한 상황에서 지원 정보를 빠르게
                                    찾을 수 있는 기능입니다.
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold mb-2">
                                                    주변 기관 찾기
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    현재 위치를 기준으로 주변의
                                                    도움 기관을 지도에서 확인할
                                                    수 있습니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold mb-2">
                                                    바로 전화 연결
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    기관 상세 화면에서 전화
                                                    버튼을 누르면 바로 연결이
                                                    가능합니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-100 text-gray-700 rounded-xl p-6 max-w-md">
                                <p className="font-bold text-center text-lg">
                                    * 메인 화면 하단의 전화 모양 플로팅 버튼을
                                    눌러 언제든지 실행할 수 있습니다.
                                </p>
                            </div>
                        </div>

                        {/* Right side - Screenshot */}
                        <div className="flex justify-center">
                            <img
                                src="/images/helpcall.png"
                                alt="헬프콜 지도 화면"
                                className="w-full max-w-3xl h-auto object-contain"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
