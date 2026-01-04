export function ClosingSection() {
  return (
    <section className="scroll-mt-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8">
            <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-3xl font-medium mb-8">왜 ieum이 필요한가요?</h2>
          <div className="text-base leading-relaxed space-y-6 opacity-95">
            <p>
              청소년기는 정체성을 형성하고, 감정을 조절하며, 사회적 관계를
              배워가는 중요한 시기입니다. 하지만 이 과정에서 우울감, 불안, 도박과
              같은 문제가 찾아올 때, 많은 청소년들이 혼자 고민하며 어디서부터
              도움을 받아야 할지 몰라 방황합니다.
            </p>
            <p>
              ieum은 그런 청소년들을 위해{" "}
              <strong className="font-semibold">
                문제를 낙인찍지 않고, 판단하지 않으며, 혼자가 아니라는 연결의
                경험
              </strong>
              을 통해 작은 변화를 함께 만들어갑니다.
            </p>
            <p>
              매일 모든 기능을 사용할 필요도, 완벽하게 기록할 필요도 없습니다.
              어떤 날은 한 문장만 남겨도 괜찮고, 어떤 날은 잠시 쉬어가도
              괜찮습니다. 중요한 것은{" "}
              <strong className="font-semibold">
                속도가 아니라 멈추지 않고 자기 방식대로 이어가는 것
              </strong>
              입니다.
            </p>
            <p className="font-semibold text-lg">
              ieum은 언제나 그 자리에서 여러분을 기다리며, 다시 시작할 수
              있도록 곁에서 함께합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
