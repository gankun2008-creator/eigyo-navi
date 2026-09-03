import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import SectionReveal from './SectionReveal';
import { SectionLabel } from './ui';

export default function ContinuitySection() {
  return (
    <SectionReveal
      direction="left"
      className="px-6 py-12 sm:py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal variant="up">
          <SectionLabel>継続して利用する理由</SectionLabel>
        </Reveal>
        <RevealHeading
          as="h2"
          lines={['月額料金は、', 'AIを使う料金ではない。']}
          className="mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem]"
        />
        <Reveal variant="up" delay={80}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5D708F] sm:text-lg">
            毎月更新される営業機会と、
            <br className="hidden sm:block" />
            自社だけの営業データへの対価です。
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
          <Reveal variant="up" delay={100}>
            <div className="card-pop h-full rounded-[28px] border border-[#DCE5F2] bg-white p-8 sm:p-10">
              <h3 className="text-xl font-bold tracking-tight text-[#0B1833] sm:text-2xl">毎月更新される営業機会</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#5D708F] sm:text-base">
                企業の変化から、新しい営業候補を継続的に見つける。
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <div className="card-pop h-full rounded-[28px] border border-[#DCE5F2] bg-white p-8 sm:p-10">
              <h3 className="text-xl font-bold tracking-tight text-[#0B1833] sm:text-2xl">自社だけの営業データ</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#5D708F] sm:text-base">
                どの企業へ連絡したか、どの営業理由に反応があったか、どの提案が商談につながったかを組織に蓄積する。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionReveal>
  );
}
