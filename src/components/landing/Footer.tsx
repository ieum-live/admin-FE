export function Footer() {
  return (
    <footer className="mt-32 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❤️</span>
              <span className="text-lg font-semibold">ieum</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              청소년의 마음 건강을 위한
              <br />
              따뜻한 동행자
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900">바로가기</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  소개
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  기능
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; 2026 ieum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
