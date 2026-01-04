import { LandingHeader } from "./landing/LandingHeader";
import { HeroSection } from "./landing/HeroSection";
import { IntroSection } from "./landing/IntroSection";
import { MeaningSection } from "./landing/MeaningSection";
import { DirectionSection } from "./landing/DirectionSection";
import { StartSection } from "./landing/StartSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { GardenGuideSection } from "./landing/GardenGuideSection";
import { CalendarSection } from "./landing/CalendarSection";
import { DiarySection } from "./landing/DiarySection";
import { QuestSection } from "./landing/QuestSection";
import { WeeklyChatSection } from "./landing/WeeklyChatSection";
import { DiagnosisSection } from "./landing/DiagnosisSection";
import { HelplineSection } from "./landing/HelplineSection";
import { ClosingSection } from "./landing/ClosingSection";
import { Footer } from "./landing/Footer";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <LandingHeader />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <HeroSection />

                <div className="space-y-20">
                    <IntroSection />
                    <MeaningSection />
                    <DirectionSection />
                    <StartSection />
                    <FeaturesSection />
                    <GardenGuideSection />
                    <CalendarSection />
                    <DiarySection />
                    <QuestSection />
                    <WeeklyChatSection />
                    <DiagnosisSection />
                    <HelplineSection />
                    <ClosingSection />
                </div>
            </div>

            <Footer />
        </div>
    );
}
