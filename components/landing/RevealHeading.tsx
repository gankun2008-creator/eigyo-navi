'use client';

import type { ReactNode } from 'react';
import { useRevealVisible } from './useRevealVisible';

type RevealHeadingProps = {
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  lineClassName?: string;
  delayStep?: number;
};

export default function RevealHeading({
  lines,
  as = 'h2',
  className = '',
  lineClassName = '',
  delayStep = 110,
}: RevealHeadingProps) {
  const { ref, visible } = useRevealVisible<HTMLHeadingElement>();

  const content = lines.map((line, index) => (
    <span
      key={index}
      className={`inline-block transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:blur-none ${
        visible ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-3 opacity-0 blur-[6px]'
      } ${lineClassName}`}
      style={{ transitionDelay: visible ? `${index * delayStep}ms` : '0ms' }}
    >
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));

  if (as === 'h1') {
    return (
      <h1 ref={ref as never} className={className}>
        {content}
      </h1>
    );
  }

  if (as === 'h3') {
    return (
      <h3 ref={ref as never} className={className}>
        {content}
      </h3>
    );
  }

  return (
    <h2 ref={ref as never} className={className}>
      {content}
    </h2>
  );
}
