import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#EAF2FF] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#1F5EFF]">
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mt-5 text-3xl font-bold leading-[1.4] tracking-tight text-[#0B1833] sm:text-4xl md:text-[2.75rem] ${className}`}
    >
      {children}
    </h2>
  );
}

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  ariaLabel?: string;
  showArrow?: boolean;
};

export function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  ariaLabel,
  showArrow = true,
}: CTAButtonProps) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none';
  const styles =
    variant === 'primary'
      ? 'bg-[#1F5EFF] text-white shadow-[0_8px_24px_-8px_rgba(31,94,255,0.45)] hover:-translate-y-[2px] hover:bg-[#154fe0] hover:shadow-[0_14px_34px_-10px_rgba(31,94,255,0.55)]'
      : 'border border-[#DCE5F2] bg-white text-[#0B1833] hover:-translate-y-[1px] hover:border-[#8FB4FF] hover:bg-[#EAF2FF] hover:text-[#154fe0]';

  return (
    <Link href={href} aria-label={ariaLabel} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      {showArrow && (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      )}
    </Link>
  );
}
