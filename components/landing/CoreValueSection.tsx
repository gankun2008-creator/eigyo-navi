'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import SectionReveal from './SectionReveal';
import { SectionLabel } from './ui';

type Step = {
  number: string;
  title: string;
  description: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    title: '誰に営業するか',
    description: '商材に合う営業候補を提示',
    detail: '商材を選ぶだけで、条件に合う企業をリストアップし、営業候補として整理します。',
  },
  {
    number: '02',
    title: 'なぜ今なのか',
    description: '企業の変化と営業理由を整理',
    detail: '企業の変化や動きから、今アプローチすべき理由をあわせて整理して提示します。',
  },
  {
    number: '03',
    title: '何を提案するか',
    description: '提案の切り口と最初の営業文を準備',
    detail: '提案の切り口や、最初の営業文の準備までを一つの流れでサポートします。',
  },
];

function StepButton({
  step,
  index,
  active,
  onSelect,
  panelId,
}: {
  step: Step;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
  panelId: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      aria-controls={panelId}
      onClick={() => onSelect(index)}
      className={`flex w-full items-center gap-5 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5EFF] focus-visible:ring-offset-2 ${
        active
          ? 'border-[#1F5EFF]/40 bg-white shadow-[0_16px_36px_-24px_rgba(31,94,255,0.45)]'
          : 'border-[#DCE5F2] bg-white/60 hover:border-[#B9CDF2] hover:bg-white'
      }`}
    >
      <span
        className={`text-2xl font-bold tabular-nums transition-colors duration-300 ${
          active ? 'text-[#1F5EFF]' : 'text-[#B9C3D6]'
        }`}
      >
        {step.number}
      </span>
      <span className={`text-base font-semibold sm:text-lg ${active ? 'text-[#0B1833]' : 'text-[#5D708F]'}`}>
        {step.title}
      </span>
    </button>
  );
}

function StepDetail({ step }: { step: Step }) {
  return (
    <div className="rounded-[28px] border border-[#DCE5F2] bg-white p-8 shadow-[0_24px_55px_-32px_rgba(15,23,42,0.3)] sm:p-10">
      <span className="text-6xl font-bold text-[#1F5EFF] sm:text-7xl">{step.number}</span>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#0B1833] sm:text-3xl">{step.title}</h3>
      <p className="mt-4 text-base leading-relaxed text-[#334155] sm:text-lg">{step.description}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#5D708F] sm:text-base">{step.detail}</p>
    </div>
  );
}

export default function CoreValueSection() {
  const [active, setActive] = useState(0);

  return (
    <SectionReveal
      id="core-value"
      direction="left"
      className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-14 md:px-10 lg:px-16 lg:pt-20 lg:pb-16"
    >
      <div className="mx-auto max-w-6xl">
      <Reveal variant="up">
        <SectionLabel>営業ナビ AIの核心</SectionLabel>
        <RevealHeading
          as="h2"
          lines={['会社名だけではなく、', '「なぜ今なのか」まで', '分かる。']}
          className="mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem]"
        />
      </Reveal>

      {/* Desktop: left step list, right detail panel — click to switch, no auto-advance */}
      <div className="mt-16 hidden gap-10 lg:grid lg:grid-cols-[360px_1fr] lg:items-start">
        <div className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} variant="up" delay={140 + index * 90}>
              <StepButton
                step={step}
                index={index}
                active={active === index}
                onSelect={setActive}
                panelId={`core-panel-desktop-${index}`}
              />
            </Reveal>
          ))}
        </div>

        <div className="relative min-h-[280px]">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              id={`core-panel-desktop-${index}`}
              role="region"
              aria-hidden={active !== index}
              className={`transition-all duration-[350ms] ease-out motion-reduce:transition-none ${
                active === index
                  ? 'relative translate-y-0 opacity-100'
                  : 'pointer-events-none absolute inset-0 translate-y-2 opacity-0'
              }`}
            >
              <StepDetail step={step} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: accordion — tap to expand, no page jump */}
      <div className="mt-12 flex flex-col gap-3 lg:hidden">
        {STEPS.map((step, index) => (
          <div key={step.number}>
            <Reveal variant="up" delay={100 + index * 80}>
              <StepButton
                step={step}
                index={index}
                active={active === index}
                onSelect={setActive}
                panelId={`core-panel-mobile-${index}`}
              />
            </Reveal>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                active === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div
                id={`core-panel-mobile-${index}`}
                role="region"
                aria-hidden={active !== index}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <StepDetail step={step} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </SectionReveal>
  );
}
