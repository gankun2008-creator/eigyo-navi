import Link from 'next/link';
import Reveal from '@/components/landing/Reveal';
import { CTAButton } from '@/components/landing/ui';

export default function VoicesCTA() {
  return (
    <section className="px-6 py-24 text-center sm:py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <Reveal variant="up">
          <CTAButton href="/home" variant="primary" className="px-10 py-4 text-base">
            営業ナビ AIを見てみる
          </CTAButton>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <p className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#5D708F] underline-offset-4 transition-colors hover:text-[#1F5EFF] hover:underline"
            >
              サービス紹介へ戻る
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
