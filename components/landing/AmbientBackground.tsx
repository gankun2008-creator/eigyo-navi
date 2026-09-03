'use client';

import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const blobCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (blobARef.current) blobARef.current.style.transform = `translate3d(0, ${y * 0.03}px, 0)`;
      if (blobBRef.current) blobBRef.current.style.transform = `translate3d(0, ${y * -0.025}px, 0)`;
      if (blobCRef.current) blobCRef.current.style.transform = `translate3d(0, ${y * 0.02}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        ref={blobARef}
        className="absolute -top-24 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.12),transparent)] blur-3xl"
      />
      <div
        ref={blobBRef}
        className="absolute top-[85vh] right-[-12%] h-[480px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(15,24,51,0.07),transparent)] blur-3xl"
      />
      <div
        ref={blobCRef}
        className="absolute top-[165vh] left-[-14%] h-[440px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(31,94,255,0.08),transparent)] blur-3xl"
      />
    </div>
  );
}
