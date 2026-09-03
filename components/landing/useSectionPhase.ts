'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useRevealVisible';

export type SectionPhase = 'before' | 'active' | 'after';

// Simple 3-state section visibility (before/active/after) instead of continuous
// scroll-position math. Two shared IntersectionObservers (same hysteresis pattern as
// useRevealVisible.ts) avoid flicker at the boundary: a narrow "enter" band promotes a
// section to active as soon as it's meaningfully centered, while a much wider "exit"
// band only demotes it once it has genuinely cleared the viewport — so a section stays
// active while the user reads it instead of flipping back and forth on small scrolls.
const enterHandlers = new Map<Element, () => void>();
const exitHandlers = new Map<Element, (top: number) => void>();
let enterObserver: IntersectionObserver | null = null;
let exitObserver: IntersectionObserver | null = null;

function getEnterObserver() {
  if (!enterObserver) {
    enterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) enterHandlers.get(entry.target)?.();
        });
      },
      // Shrinks the viewport to the band between 20% and 65% from the top — a section
      // is promoted to "active" once it meaningfully enters that middle band.
      { threshold: 0, rootMargin: '-20% 0px -35% 0px' }
    );
  }
  return enterObserver;
}

function getExitObserver() {
  if (!exitObserver) {
    exitObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) exitHandlers.get(entry.target)?.(entry.boundingClientRect.top);
        });
      },
      // Grows the viewport by 20% on each side, so a section is only demoted once it
      // has genuinely scrolled well clear of view, not the instant it touches an edge.
      { threshold: 0, rootMargin: '20% 0px 20% 0px' }
    );
  }
  return exitObserver;
}

export function useSectionPhase<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<SectionPhase>('before');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    // Reduced-motion visitors skip the observers entirely — see the `reducedMotion ?
    // 'active' : phase` below for how they still always render fully visible/settled.
    if (!node || reducedMotion) return;

    const eo = getEnterObserver();
    const xo = getExitObserver();
    enterHandlers.set(node, () => setPhase('active'));
    exitHandlers.set(node, top => setPhase(top < 0 ? 'after' : 'before'));
    eo.observe(node);
    xo.observe(node);

    return () => {
      eo.unobserve(node);
      xo.unobserve(node);
      enterHandlers.delete(node);
      exitHandlers.delete(node);
    };
  }, [reducedMotion]);

  return { ref, phase: reducedMotion ? 'active' : phase };
}
