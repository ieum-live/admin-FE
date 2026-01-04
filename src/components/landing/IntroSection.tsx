import { Sparkles, CheckCircle, Heart } from "lucide-react";

export function IntroSection() {
  return (
    <section className="scroll-mt-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block bg-black text-white text-sm font-medium px-4 py-1 rounded mb-5">
          01
        </div>
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          ieum은 어떤 앱인가요?
        </h2>
        <p className="text-base text-gray-500 font-light">
          청소년의 복합적인 문제를 하나의 흐름으로 이어주는 통합 플랫폼
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-16 shadow-sm">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-5">
              <Sparkles className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900">조기 인식</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              도박 문제와 우울을 우울, 불안, 고립감
              <br />과 연결하여 조기 발견
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-5">
              <CheckCircle className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900">통합 지원</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              진단, 상담, 관리가 분절되지 않고 하나
              <br />의 흐름으로 연결
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-5">
              <Heart className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900">지속적 회복</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              스스로 점검하고 이해하며 회복을 이어
              <br />갈 수 있는 플랫폼
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
