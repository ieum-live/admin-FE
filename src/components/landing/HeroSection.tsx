import { Smartphone, Apple } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative mb-12 sm:mb-16 md:mb-24 lg:mb-32 overflow-hidden">
      <div className="w-full">
        <div className="relative flex items-center min-h-[320px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] pl-3 sm:pl-5 md:pl-6 lg:pl-8">
          {/* Left side - Text content */}
          <div className="relative z-10 max-w-[180px] sm:max-w-[280px] md:max-w-md lg:max-w-lg space-y-2.5 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="flex flex-col items-end pr-2 sm:pr-4 md:pr-5 lg:pr-6 space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3">
              <img src="/images/ieumlogo-g.png" alt="ieum" className="h-10 sm:h-12 md:h-16 lg:h-20" />

              <h1 className="text-[0.7rem] sm:text-[0.85rem] md:text-[1.05rem] lg:text-[1.2rem] font-normal text-gray-700 leading-relaxed text-right">
                청소년의 도박 문제와 우울을 조기에 인식하고,
                <br />
                자가진단부터 예방, 사후 케어까지 이어주는 모바일 어플리케이션
              </h1>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2 md:pt-4">
              <a
                href="https://drive.google.com/file/d/1Wi4xSqzFcZTGQibYc955xoaMo-o30Ne4/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-md text-sm font-normal hover:bg-gray-800 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                Android (APK) 다운로드
              </a>
              <button
                onClick={() => alert("아직 준비중입니다")}
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-md text-sm font-normal hover:bg-gray-50 transition-all"
              >
                <Apple className="w-4 h-4" />
                iOS (IPK) 다운로드
              </button>
            </div>
          </div>

          {/* Right side - Landing image (overlapping) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[68%] sm:w-[70%] md:w-[72%] lg:w-[75%]">
            <img
              src="/images/landing-img.png"
              alt="ieum app showcase"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
