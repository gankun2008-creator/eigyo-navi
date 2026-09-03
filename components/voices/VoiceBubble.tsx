import type { SampleComment } from './sample-comments';

type VoiceBubbleProps = {
  comment: SampleComment;
  align?: 'left' | 'right';
  compact?: boolean;
  className?: string;
};

export default function VoiceBubble({ comment, align = 'left', compact = false, className = '' }: VoiceBubbleProps) {
  return (
    <div className={`relative ${align === 'right' ? 'sm:ml-auto' : ''} ${className}`}>
      <div
        className={`relative rounded-[28px] border border-[#D7E4FA] bg-white shadow-[0_18px_40px_-28px_rgba(31,94,255,0.4)] ${
          compact ? 'p-5' : 'p-6 sm:p-8'
        }`}
      >
        <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-semibold tracking-wide text-[#1F5EFF]">
          {comment.role}
        </span>
        <p className={`mt-3 leading-[1.9] text-[#26344D] ${compact ? 'text-sm' : 'text-[0.95rem] sm:text-base'}`}>
          {comment.text}
        </p>
        <span
          aria-hidden="true"
          className={`absolute -bottom-[7px] h-4 w-4 rotate-45 rounded-[3px] border-b border-r border-[#D7E4FA] bg-white ${
            align === 'right' ? 'right-8' : 'left-8'
          }`}
        />
      </div>
    </div>
  );
}
