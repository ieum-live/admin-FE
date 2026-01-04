import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export function GardenGuideSection() {
    return (
        <section className="scroll-mt-6">
            <div className="text-center mb-12">
                <Badge className="text-lg px-4 py-2 mb-4 bg-black text-white hover:bg-black">
                    06
                </Badge>
                <h2 className="text-4xl font-semibold mb-4">
                    메인 홈 화면 상세 가이드
                </h2>
                <p className="text-lg text-gray-600">
                    ieum 메인 홈 화면의 마음 정원을 자세히 알아보세요
                </p>
            </div>

            <Card className="border-2 shadow-lg max-w-5xl mx-auto">
                <CardContent className="p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">
                                    <span className="mr-2">🌱</span>
                                    마음 정원
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    매일 활동을 통해 얻은 물 주기 쿠폰을 통해
                                    클로버를 키워 나만의 토끼를 정원을 키워
                                    보세요.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-green-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                물 주기 시스템
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                퀘스트, 일기, 진단 등을 완료하여
                                                쿠폰 획득
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-green-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                레벨 시스템
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                꽃 송이 개수가 레벨이 되어 나의
                                                성장을 직접적으로 확인
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-green-600 font-bold">
                                                ○
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">
                                                보너스 요소
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                연속 사용 시 보너스 쿠폰 획득
                                                기회 제공
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Screenshot */}
                        <div className="flex justify-center">
                            <img
                                src="/images/gardenguide.png"
                                alt="마음 정원 가이드 화면"
                                className="w-full max-w-md h-auto"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
