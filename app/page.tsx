import type { Metadata } from 'next';
import AmbientBackground from '@/components/landing/AmbientBackground';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import CoreValueSection from '@/components/landing/CoreValueSection';
import PricingSection from '@/components/landing/PricingSection';
import TrialBenefitSection from '@/components/landing/TrialBenefitSection';
import ContinuitySection from '@/components/landing/ContinuitySection';
import VoicesSection from '@/components/landing/VoicesSection';
import CompanySection from '@/components/landing/CompanySection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: '営業ナビ AI｜営業先を探す時間を、商談をつくる時間へ。',
  description:
    '企業の変化から、今アプローチすべき営業先と、その理由を提示する法人営業支援サービス「営業ナビ AI」。',
};

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-[#F7F9FD]">
      <AmbientBackground />
      <LandingHeader />
      <main>
        <HeroSection />
        <CoreValueSection />
        <PricingSection />
        <TrialBenefitSection />
        <ContinuitySection />
        <VoicesSection />
        <CompanySection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
