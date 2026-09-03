import Link from 'next/link';
import Reveal from '@/components/landing/Reveal';
import RevealHeading from '@/components/landing/RevealHeading';

export default function VoicesHeader() {
  return (
    <header>
      <div className="border-b border-[#DCE5F2] bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#0B1833]">
            営業ナビ <span className="text-[#1F5EFF]">AI</span>
          </Link>
          <Link
            href="/#voices"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#5D708F] transition-colors duration-300 hover:text-[#1F5EFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5EFF] focus-visible:ring-offset-2 rounded-md"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            >
              <path d="M16 10H4M9 5l-5 5 5 5" />
            </svg>
            サービス紹介へ戻る
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4 pt-14 sm:pt-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal variant="up">
            <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#1F5EFF]">
              VOICE SCENARIOS
            </span>
          </Reveal>

          <RevealHeading
            as="h1"
            lines={['営業現場での、', '利用イメージ。']}
            className="mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem]"
          />

          <Reveal variant="up" delay={100}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5D708F] sm:text-lg">
              営業ナビ AIを利用する場面を、サンプルコメントで紹介します。
            </p>
          </Reveal>

          <Reveal variant="up" delay={180}>
            <div className="mt-8 max-w-2xl rounded-2xl border border-[#DCE5F2] bg-white px-6 py-5">
              <p className="text-sm font-semibold leading-relaxed text-[#0B1833] sm:text-base">
                以下は実在するお客様の声ではありません。
                <br />
                サービスの利用場面を説明するためのサンプルです。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
