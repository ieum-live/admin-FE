export function DirectionSection() {
  return (
    <section className="scroll-mt-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block bg-black text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
          03
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          ieum이 지향하는 방향
        </h2>
        <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
          ieum은 문제를 낙인찍지 않고, 청소년이{" "}
          <strong className="text-gray-900 font-semibold">
            혼자가 아니라는 연결의 경험
          </strong>{" "}
          속에서 작은 변화와 회복을 이어갈 수 있도록 돕는 플랫폼입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">자가진단</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            부담 없는 자가진단을 통해 문제를 인식합니다
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
            <span className="text-4xl">🛡️</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">위험 관리</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            예방 중심 구조로 위험을 조기에 관리합니다
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
            <span className="text-4xl">💚</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">사후 케어</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            기록과 피드백으로 지속적 지원을 제공합니다
          </p>
        </div>
      </div>
    </section>
  );
}
