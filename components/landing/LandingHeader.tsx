'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { href: '#pricing', label: '料金' },
  { href: '/#voices', label: 'お客様の声' },
  { href: '#company', label: '会社概要' },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Publishes the header's real rendered height as a CSS var so the full-bleed hero
  // below it can size itself off the actual value instead of a guessed constant.
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${node.offsetHeight}px`);
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-[#DCE5F2] shadow-[0_2px_20px_-8px_rgba(15,23,42,0.08)]'
          : 'bg-white/40 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#0B1833]">
          営業ナビ <span className="text-[#1F5EFF]">AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="サイト内リンク">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5D708F] transition-colors hover:text-[#0B1833]"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/home"
            className="inline-flex items-center justify-center rounded-full bg-[#1F5EFF] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#154fe0] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5EFF] focus-visible:ring-offset-2"
          >
            申し込みはこちら
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(open => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5F2] bg-white text-[#0B1833] md:hidden"
        >
          <span className="sr-only">{menuOpen ? 'メニューを閉じる' : 'メニューを開く'}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          menuOpen ? 'max-h-80 border-b border-[#DCE5F2] bg-white' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4" aria-label="モバイルサイト内リンク">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[#0B1833] transition-colors hover:bg-[#EAF2FF]"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/home"
            onClick={handleNavClick}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#1F5EFF] px-5 py-3 text-sm font-semibold text-white"
          >
            申し込みはこちら
          </Link>
        </nav>
      </div>
    </header>
  );
}
