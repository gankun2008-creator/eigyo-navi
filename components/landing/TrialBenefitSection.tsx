'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import SectionReveal from './SectionReveal';
import { useRevealVisible } from './useRevealVisible';
import { SectionLabel } from './ui';

type StepAccent = 'contract' | 'carryover' | 'discount';

type Step = {
  step: string;
  title: string;
  detail: string;
  accent?: StepAccent;
};

const STEPS: Step[] = [
  {
    step: 'STEP 1',
    title: '無料トライアル開始',
    detail: '3か月無料で利用開始',
  },
  {
    step: 'STEP 2',
    title: '2か月目に本契約',
    detail: '5アカウントで本契約',
    accent: 'contract',
  },
  {
    step: 'STEP 3',
    title: '残り1か月分を引き継ぐ',
    detail: '未消化分\n25,000円相当',
    accent: 'carryover',
  },
  {
    step: 'STEP 4',
    title: '本契約後6か月に分けて割引',
    detail: '毎月約4,167円割引\n割引総額25,000円',
    accent: 'discount',
  },
];

const MONTH_LABELS = ['1か月目', '2か月目', '3か月目', '4か月目', '5か月目', '6か月目'];

// Idle-state (unselected) accent per step — a permanent, subtle cue for STEP 2-4 so the
// "contract moment / carried-over value / the payoff" read at a glance even before the
// visitor clicks anything. Selecting a card (any card) always converges to the same
// "selected" look below, so these idle accents never fight that state.
const ACCENT_IDLE: Record<StepAccent, string> = {
  contract: 'border-[#B9CDF2] bg-[#F5F8FF]',
  carryover: 'border-[#BFD6FF] bg-[#EAF2FF]',
  discount: 'border-[#1F5EFF]/25 bg-white shadow-[0_18px_38px_-28px_rgba(31,94,255,0.4)]',
};

function StepCard({ step, index, selected, onSelect }: { step: Step; index: number; selected: boolean; onSelect: (index: number) => void }) {
  const idleClass = step.accent ? ACCENT_IDLE[step.accent] : 'border-[#DCE5F2] bg-white/70 hover:border-[#B9CDF2] hover:bg-white';
  const lines = step.detail.split('\n');

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(index)}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5EFF] focus-visible:ring-offset-2 motion-reduce:transition-colors sm:flex-col lg:items-center lg:text-center ${
        selected
          ? 'border-[#1F5EFF] bg-white shadow-[0_20px_44px_-26px_rgba(31,94,255,0.5)] lg:-translate-y-1 motion-reduce:lg:translate-y-0'
          : `${idleClass} motion-reduce:hover:translate-y-0`
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
          selected ? 'bg-[#1F5EFF] text-white' : 'bg-[#EAF2FF] text-[#1F5EFF]'
        }`}
      >
        {index + 1}
      </span>
      <span className="flex flex-col gap-1.5 sm:mt-3 lg:items-center">
        <span className="text-xs font-semibold tracking-wide text-[#1F5EFF]">{step.step}</span>
        <span className="text-base font-bold text-[#0B1833]">{step.title}</span>
        <span className="text-sm leading-relaxed text-[#5D708F]">
          {lines.map((line, i) => (
            <span
              key={i}
              className={
                step.accent === 'discount' && i === lines.length - 1
                  ? 'mt-0.5 block text-base font-bold text-[#1F5EFF] sm:text-lg'
                  : 'block'
              }
            >
              {line}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

// Steps get their own hand-tuned reveal (350-500ms per card, 70-120ms stagger) instead
// of the shared `Reveal` component's fixed 700ms — see the design note in the PR: this
// keeps the whole 4-step sequence settling inside ~650ms. The entrance transform lives
// on this `<li>` wrapper, never on the `<button>` itself, so it can't fight the button's
// own click/hover elevation transform (same split used elsewhere for `number-pop`).
function Timeline({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const { ref, visible } = useRevealVisible<HTMLOListElement>();
  const progress = (active / (STEPS.length - 1)) * 75; // track spans 12.5%–87.5% (node-center to node-center)

  return (
    <div className="relative mt-12">
      {/* top-10 = card padding (p-5 = 20px) + half the node's own height (h-10 / 2 =
          20px) — lines up with the node's vertical center, not its top edge. */}
      <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-[#DCE5F2] lg:block" />
      <div
        aria-hidden="true"
        className="absolute left-[12.5%] top-10 hidden h-px bg-[#1F5EFF] transition-[width] duration-500 ease-out motion-reduce:transition-none lg:block"
        style={{ width: `${progress}%` }}
      />
      <div aria-hidden="true" className="absolute left-10 top-2 bottom-2 w-px bg-[#DCE5F2] sm:hidden" />

      <ol ref={ref} className="relative grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.step}
            className={`transition-all duration-[420ms] ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: visible ? `${index * 90}ms` : '0ms' }}
          >
            <StepCard step={step} index={index} selected={active === index} onSelect={onSelect} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 rotate-90 text-[#B9C3D6] sm:rotate-0"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function TrialBenefitSection() {
  const [active, setActive] = useState(0);

  return (
    <SectionReveal
      id="trial-benefit"
      direction="right"
      className="slide-short relative px-6 py-12 sm:py-16 md:px-10 lg:px-16 lg:py-20"
    >
      {/* Local depth cue, not a section-wide fill — the outer section stays transparent
          so the LP's single base background shows through with no boundary line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 left-1/2 top-1/3 h-[460px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.08),transparent)] blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        <Reveal variant="up">
          <SectionLabel>3か月無料トライアル</SectionLabel>
        </Reveal>

        <RevealHeading
          as="h2"
          lines={['早く本契約しても、', '残りの無料期間は無駄になりません。']}
          className="mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem]"
        />

        <Reveal variant="up" delay={80}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5D708F] sm:text-lg">
            未消化の無料トライアル相当額を、
            <br className="hidden sm:block" />
            本契約開始後6か月に分けて基本料金から割り引きます。
          </p>
        </Reveal>

        <Reveal variant="fade" delay={140}>
          <p className="mt-4 inline-flex items-center rounded-full border border-[#DCE5F2] bg-white px-3 py-1 text-xs font-medium text-[#5D708F]">
            5アカウントで、無料トライアル2か月目に本契約した場合の例です。
          </p>
        </Reveal>

        <Timeline active={active} onSelect={setActive} />

        <Reveal variant="up" delay={60}>
          <div className="mt-16">
            <h3 className="text-lg font-bold tracking-tight text-[#0B1833] sm:text-xl">本契約後6か月の割引イメージ</h3>

            <Reveal variant="up" delay={80}>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {MONTH_LABELS.map(label => (
                  <div key={label} className="rounded-2xl border border-[#DCE5F2] bg-white px-3 py-4 text-center">
                    <p className="text-xs font-semibold text-[#5D708F]">{label}</p>
                    <p className="mt-2 text-sm font-bold text-[#1F5EFF] sm:text-base">− 約4,167円</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="up" delay={160}>
              <div className="mt-8 rounded-[28px] border border-[#DCE5F2] bg-white p-8 sm:p-10">
                <p className="text-sm font-semibold text-[#5D708F]">6か月の割引総額</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-[#1F5EFF] sm:text-5xl">25,000円</p>

                <Reveal variant="fade" delay={260}>
                  <div className="mt-8 flex flex-col items-start gap-4 border-t border-[#DCE5F2] pt-6 sm:flex-row sm:items-center sm:gap-6">
                    <div>
                      <p className="text-xs font-semibold text-[#5D708F]">5アカウントの通常月額</p>
                      <p className="mt-1 text-xl font-bold text-[#0B1833] sm:text-2xl">25,000円</p>
                    </div>
                    <ArrowIcon />
                    <div>
                      <p className="text-xs font-semibold text-[#5D708F]">割引期間中の月額</p>
                      <p className="mt-1 text-xl font-bold text-[#0B1833] sm:text-2xl">約20,833円</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </Reveal>

            <Reveal variant="fade" delay={320}>
              <p className="mt-6 max-w-2xl text-xs leading-relaxed text-[#5D708F]">
                無料トライアル中に本契約した場合、未消化期間に相当する料金を、本契約開始後6か月に分けて割引します。
                割引額は、契約アカウント数と本契約の開始時期により異なります。
              </p>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </SectionReveal>
  );
}
