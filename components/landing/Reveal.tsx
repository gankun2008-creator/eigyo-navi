'use client';

import type { ReactNode } from 'react';
import { useRevealVisible } from './useRevealVisible';

type RevealVariant = 'fade' | 'up' | 'scale';

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
};

const VARIANT_HIDDEN: Record<RevealVariant, string> = {
  fade: 'opacity-0',
  up: 'opacity-0 translate-y-6',
  scale: 'opacity-0 scale-95',
};

const VARIANT_VISIBLE: Record<RevealVariant, string> = {
  fade: 'opacity-100',
  up: 'opacity-100 translate-y-0',
  scale: 'opacity-100 scale-100',
};

export default function Reveal({ children, variant = 'up', delay = 0, className = '', as = 'div' }: RevealProps) {
  const { ref, visible } = useRevealVisible<HTMLDivElement>();
  const Comp = as;

  return (
    <Comp
      ref={ref as never}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 ${
        visible ? VARIANT_VISIBLE[variant] : VARIANT_HIDDEN[variant]
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Comp>
  );
}
