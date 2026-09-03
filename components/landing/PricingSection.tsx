import Reveal from './Reveal';
import SectionReveal from './SectionReveal';
import { CTAButton } from './ui';

export default function PricingSection() {
  return (
    <SectionReveal
      id="pricing"
      direction="right"
      className="px-6 pb-12 pt-10 sm:pb-16 sm:pt-12 md:px-10 lg:px-16 lg:pb-20 lg:pt-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <div className="relative">
            {/* Local depth cue behind the price, not a section-wide fill — stays inside
                this column and fades to fully transparent well before its own edge. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 left-1/2 top-1/2 h-[440px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.10),transparent)] blur-3xl"
            />
            <h2 className="text-3xl font-bold leading-[1.3] tracking-tight text-[#0B1833] sm:text-4xl">
              <Reveal variant="up" as="span" className="block">
                営業担当者1人
              </Reveal>
              {/* number-pop (section-phase-driven scale/blur) lives on this wrapper, not
                  on Reveal's own element, so it never fights Reveal's one-shot entrance
                  transform for the same `transform` property. */}
              <div className="number-pop block">
                <Reveal variant="scale" delay={160} as="span" className="block">
                  <span className="text-[5.5rem] leading-none text-[#1F5EFF] sm:text-[7rem] md:text-[8rem]">
                    250円
                  </span>
                  <span className="ml-2 align-baseline text-2xl font-bold text-[#0B1833] sm:text-3xl">
                    / 1営業日
                  </span>
                </Reveal>
              </div>
            </h2>

            <Reveal variant="up" delay={120}>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-[#5D708F]">
                1営業日250円は、月額5,000円を月20営業日で換算した金額です。
              </p>
            </Reveal>
          </div>

          <Reveal variant="up" delay={280}>
            <div className="card-pop rounded-[28px] border border-[#DCE5F2] bg-white p-8 shadow-[0_25px_55px_-30px_rgba(15,23,42,0.2)] sm:p-10">
              <p className="text-sm font-semibold text-[#5D708F]">1アカウント</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-[#0B1833]">月額5,000円</p>

              <Reveal variant="fade" delay={160}>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EAF2FF] px-4 py-2">
                  <span className="text-sm font-semibold text-[#1F5EFF]">3か月無料トライアル</span>
                </div>
              </Reveal>

              <div className="mt-8 space-y-4 border-t border-[#DCE5F2] pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5D708F]">最低契約数</span>
                  <span className="font-semibold text-[#0B1833]">5アカウント</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5D708F]">最低利用料金</span>
                  <span className="font-semibold text-[#0B1833]">月額25,000円から</span>
                </div>
              </div>

              <CTAButton href="/home" variant="primary" className="mt-9 w-full">
                申し込みはこちら
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionReveal>
  );
}
