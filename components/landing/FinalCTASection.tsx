import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import SectionReveal from './SectionReveal';
import { CTAButton } from './ui';

export default function FinalCTASection() {
  return (
    <SectionReveal
      direction="bottom"
      className="relative flex min-h-[56vh] min-h-[56svh] flex-col items-center justify-center px-6 py-24 text-center md:px-10"
    >
      {/* Local depth cue behind the closing copy, not a section-wide fill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 left-1/2 top-1/2 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.12),transparent)] blur-3xl"
      />
      <RevealHeading
        as="h2"
        lines={['検索する営業から、', '売れる兆しが届く営業へ。']}
        className="mx-auto max-w-3xl text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-5xl md:text-[3.25rem] md:leading-[1.35]"
      />

      <Reveal variant="up" delay={140}>
        <p className="mt-7 text-base leading-relaxed text-[#5D708F] sm:text-lg">
          明日連絡すべき企業と、その理由を見つける。
        </p>
      </Reveal>

      <Reveal variant="up" delay={260}>
        <div className="card-pop mt-12">
          <CTAButton href="/home" variant="primary" className="px-10 py-4 text-base">
            申し込みはこちら
          </CTAButton>
        </div>
      </Reveal>
    </SectionReveal>
  );
}
