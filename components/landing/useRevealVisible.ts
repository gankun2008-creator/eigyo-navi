'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

// Two shared observers give Reveal/RevealHeading a hysteresis: an element becomes
// visible as soon as it meaningfully enters the viewport, but only resets once it has
// moved well clear of it. That gap prevents flicker at section boundaries while still
// allowing replay from either scroll direction, and keeps the app to two observer
// instances total instead of one per animated element.
const enterHandlers = new Map<Element, () => void>();
const exitHandlers = new Map<Element, () => void>();
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
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
  }
  return enterObserver;
}

function getExitObserver() {
  if (!exitObserver) {
    exitObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) exitHandlers.get(entry.target)?.();
        });
      },
      // Grows the root by 40% of the viewport on each side, so a reset only fires once
      // the element is well outside view — not merely past the edge.
      { threshold: 0, rootMargin: '40% 0px 40% 0px' }
    );
  }
  return exitObserver;
}

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

// useSyncExternalStore (rather than an effect + setState) is the pattern React
// recommends for reading a browser-only API like matchMedia: the server snapshot
// keeps SSR output deterministic, and React reconciles the real client value on its
// own once mounted — no hydration mismatch, no synchronous setState-in-effect.
export function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

export function useRevealVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [scrollVisible, setScrollVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    const eo = getEnterObserver();
    const xo = getExitObserver();
    enterHandlers.set(node, () => setScrollVisible(true));
    exitHandlers.set(node, () => setScrollVisible(false));
    eo.observe(node);
    xo.observe(node);

    return () => {
      eo.unobserve(node);
      xo.unobserve(node);
      enterHandlers.delete(node);
      exitHandlers.delete(node);
    };
  }, [reducedMotion]);

  // The `motion-reduce:` Tailwind variants already force full visibility via CSS for
  // reduced-motion visitors; folding it in here too keeps every consumer's `visible`
  // value honest without each of them needing to know about the media query.
  return { ref, visible: scrollVisible || reducedMotion };
}
