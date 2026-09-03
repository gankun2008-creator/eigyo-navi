import Reveal from './Reveal';
import SectionReveal from './SectionReveal';
import { SectionLabel } from './ui';

export default function CompanySection() {
  return (
    <SectionReveal
      id="company"
      direction="left"
      className="px-6 py-12 sm:py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <div className="relative mx-auto max-w-6xl">
        {/* Local depth cue behind the company card, not a section-wide fill. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 left-1/2 top-1/2 h-[420px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.08),transparent)] blur-3xl"
        />
        <Reveal variant="up">
          <SectionLabel>COMPANY</SectionLabel>
          <h2 className="mt-7 whitespace-nowrap text-[clamp(1.5rem,7vw,4.25rem)] font-bold leading-[1.25] tracking-tight text-[#0B1833]">
            株式会社 透奇芽算法
          </h2>
        </Reveal>

        <Reveal variant="up" delay={140}>
          <dl className="card-pop mt-14 grid gap-8 rounded-[28px] border border-[#DCE5F2] bg-white p-8 shadow-[0_25px_55px_-35px_rgba(31,94,255,0.3)] sm:grid-cols-2 sm:p-10">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-[#1F5EFF]">サービス名</dt>
              <dd className="mt-2 text-lg font-semibold text-[#0B1833]">営業ナビ AI</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-[#1F5EFF]">コンセプト</dt>
              <dd className="mt-2 text-lg font-semibold text-[#0B1833]">営業先を探す時間を、商談をつくる時間へ。</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </SectionReveal>
  );
}
