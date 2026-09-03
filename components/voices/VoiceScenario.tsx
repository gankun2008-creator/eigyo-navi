import Reveal from '@/components/landing/Reveal';
import VoiceBubble from './VoiceBubble';
import { SAMPLE_COMMENTS } from './sample-comments';

export default function VoiceScenario() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
      {SAMPLE_COMMENTS.map((comment, index) => {
        const align = index % 2 === 0 ? 'left' : 'right';
        return (
          <li key={`${comment.role}-${index}`} className={align === 'right' ? 'sm:mt-10' : undefined}>
            <Reveal variant="up" delay={index * 90}>
              <VoiceBubble comment={comment} align={align} />
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
