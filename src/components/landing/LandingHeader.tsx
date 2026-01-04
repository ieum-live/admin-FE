import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingHeader() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/images/ieumlogo-w.png"
            alt="ieum logo"
            className="h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-all shadow-sm hover:shadow-md"
          >
            <User className="w-4 h-4" />
            관리자 페이지 바로가기
          </button>
        </div>
      </div>
    </nav>
  );
}
