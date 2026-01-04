export function FAQSection() {
  return (
    <section className="scroll-mt-6">
      <div className="text-center mb-12">
        <div className="inline-block bg-black text-white text-sm px-3 py-1.5 rounded mb-6">
          13
        </div>
        <h2 className="text-3xl font-medium mb-3">자주 묻는 질문</h2>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
              Q
            </span>
            <h3 className="text-lg font-semibold flex-1">
              기록을 삭제하면 복구되나요?
            </h3>
          </div>
          <p className="text-sm text-gray-600 pl-8 leading-relaxed">
            아니요, 삭제된 기록은 복구할 수 없습니다. 삭제 전에 신중하게
            확인해주세요.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
              Q
            </span>
            <h3 className="text-lg font-semibold flex-1">
              로그아웃하면 기록이 사라지나요?
            </h3>
          </div>
          <p className="text-sm text-gray-600 pl-8 leading-relaxed">
            아니요, 로그아웃해도 모든 기록은 서버에 안전하게 보관됩니다. 다시
            로그인하면 이전 기록을 모두 확인할 수 있습니다.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
              Q
            </span>
            <h3 className="text-lg font-semibold flex-1">
              앱을 삭제하면 데이터는 어떻게 되나요?
            </h3>
          </div>
          <p className="text-sm text-gray-600 pl-8 leading-relaxed">
            앱을 삭제해도 계정 정보와 기록은 서버에 보관됩니다. 앱을 다시
            설치하고 로그인하면 이전 데이터를 불러올 수 있습니다. 단, 회원
            탈퇴를 진행한 경우에는 모든 데이터가 영구 삭제됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
