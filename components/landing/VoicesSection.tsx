import type { CSSProperties } from 'react';
import Reveal from './Reveal';
import RevealHeading from './RevealHeading';
import SectionReveal from './SectionReveal';
import VoiceBubble from '@/components/voices/VoiceBubble';
import { SAMPLE_COMMENTS } from '@/components/voices/sample-comments';
import { CTAButton, SectionLabel } from './ui';

export default function VoicesSection() {
  const preview = SAMPLE_COMMENTS.slice(0, 2);

  return (
    <SectionReveal
      id="voices"
      direction="right"
      className="px-6 py-12 sm:py-16 md:px-10 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal variant="up">
              <SectionLabel>VOICE PREVIEW</SectionLabel>
            </Reveal>

            <RevealHeading
              as="h2"
              lines={['営業現場では、', 'どう使われるのか。']}
              className="mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem]"
            />

            <Reveal variant="up" delay={100}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#5D708F] sm:text-lg">
                営業ナビ AIを利用する場面を、
                <br className="hidden sm:block" />
                サンプルコメントでご覧いただけます。
              </p>
            </Reveal>

            <Reveal variant="up" delay={180}>
              <div className="mt-9 flex flex-col items-start gap-3">
                <CTAButton href="/voices" variant="primary">
                  お客様の声はこちら
                </CTAButton>
                <p className="text-xs leading-relaxed text-[#5D708F]">
                  掲載内容は、利用場面を説明するためのサンプルです。
                </p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            {preview.map((comment, index) => (
              <Reveal key={comment.role} variant="up" delay={120 + index * 140}>
                <div
                  className="bubble-pop"
                  style={{ '--bubble-rot': index % 2 === 0 ? '-1deg' : '1deg' } as unknown as CSSProperties}
                >
                  <VoiceBubble comment={comment} align={index % 2 === 0 ? 'left' : 'right'} compact />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
