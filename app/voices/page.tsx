import type { Metadata } from 'next';
import VoicesHeader from '@/components/voices/VoicesHeader';
import VoiceScenario from '@/components/voices/VoiceScenario';
import VoicesCTA from '@/components/voices/VoicesCTA';

export const metadata: Metadata = {
  title: '利用イメージ（サンプル）｜営業ナビ AI',
  description:
    '営業ナビ AIを利用する場面を、サンプルコメントで紹介します。実在するお客様の声ではありません。',
};

export default function VoicesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F9FD]">
      <VoicesHeader />
      <main className="px-6 py-16 sm:py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <VoiceScenario />
        </div>
      </main>
      <VoicesCTA />
    </div>
  );
}
