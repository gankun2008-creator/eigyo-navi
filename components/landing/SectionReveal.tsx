'use client';

import type { ElementType, ReactNode } from 'react';
import { useSectionPhase } from './useSectionPhase';

type Direction = 'left' | 'right' | 'bottom';

const DIRECTION_CLASS: Record<Direction, string> = {
  left: 'slide-left',
  right: 'slide-right',
  bottom: 'slide-bottom',
};

type SectionRevealProps = {
  as?: ElementType;
  id?: string;
  direction: Direction;
  className?: string;
  children: ReactNode;
};

// Whole-section directional slide, driven by a plain before/active/after state (see
// useSectionPhase) instead of continuous scroll math — no sticky, no extra scroll
// track, just a CSS transition on transform/opacity that plays once per state change.
export default function SectionReveal({ as: Comp = 'section', id, direction, className = '', children }: SectionRevealProps) {
  const { ref, phase } = useSectionPhase<HTMLElement>();

  return (
    <Comp id={id} ref={ref} data-phase={phase} className={`section-slide ${DIRECTION_CLASS[direction]} ${className}`}>
      {children}
    </Comp>
  );
}
