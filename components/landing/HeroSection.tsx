import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import HeroImage from './HeroImage';
import { CTAButton, SectionLabel } from './ui';

export default function HeroSection() {
  return (
    <section className="hero-fullbleed relative isolate overflow-hidden">
      <HeroImage />

      {/* Readability protection: only needed once the copy overlays the photo (`lg` up).
          Below that the copy sits in the plain space under the image instead. Built as
          soft, wide, many-stop gradients (never a single sharp band) so no edge reads
          as a visible line — the photo stays clear everywhere outside the copy column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_60%_74%_at_25%_52%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.78)_18%,rgba(255,255,255,0.58)_36%,rgba(255,255,255,0.34)_54%,rgba(255,255,255,0.14)_72%,rgba(255,255,255,0)_88%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.28)_20%,rgba(255,255,255,0.14)_38%,rgba(255,255,255,0)_58%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[18%] bg-gradient-to-b from-transparent to-[#E4ECFB]/35 lg:block"
      />

      <div className="absolute inset-0 flex items-start pt-[calc(38svh+16px)] lg:items-center lg:pt-0">
        <div className="mx-auto w-full max-w-6xl px-6 pb-6 md:px-10 lg:px-12 lg:pb-0">
          <div className="max-w-[560px] lg:max-w-[420px] xl:max-w-[600px]">
            <Reveal variant="up" delay={0}>
              <SectionLabel>法人営業チームのための営業判断支援</SectionLabel>
            </Reveal>

            <RevealHeading
              as="h1"
              lines={['営業先を探す時間を、', '商談をつくる時間へ。']}
              className="mt-4 text-[1.75rem] font-bold leading-[1.35] tracking-tight text-[#0B1833] sm:mt-6 sm:text-5xl md:text-[3.4rem] md:leading-[1.3] lg:text-[2.5rem] xl:text-[3.4rem]"
            />

            {/* Narrower than the heading on purpose: the heading's own max-width is wide
                enough that, combined with the `lg`+ overlay layout, an unbroken second
                line would run into the laptop in the photo. Keeping the two-line break
                (not just hiding it below `lg`) plus this tighter cap keeps the copy off
                the image at every breakpoint from `lg` up. */}
            <Reveal variant="up" delay={220}>
              <p className="mt-4 text-base leading-relaxed text-[#2D405F] sm:mt-6 sm:text-lg lg:max-w-[400px] lg:text-base xl:max-w-[460px] xl:text-xl min-[1440px]:max-w-[520px]">
                商材を選ぶだけで、
                <br />
                今アプローチすべき企業と理由が分かります。
              </p>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
                <CTAButton href="/home" variant="primary">
                  申し込みはこちら
                </CTAButton>
                <CTAButton href="/#pricing" variant="secondary">
                  料金を見る
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
