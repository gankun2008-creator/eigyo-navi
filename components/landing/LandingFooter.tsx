import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '#pricing', label: '料金' },
  { href: '/#voices', label: 'お客様の声' },
  { href: '#company', label: '会社概要' },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#DCE5F2] bg-white px-6 py-12 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-base font-bold tracking-tight text-[#0B1833]">
            営業ナビ <span className="text-[#1F5EFF]">AI</span>
          </p>
          <p className="mt-1 text-sm text-[#5D708F]">株式会社 透奇芽算法</p>
        </div>

        <nav className="flex flex-wrap items-center gap-6" aria-label="フッターリンク">
          {FOOTER_LINKS.map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-[#5D708F] hover:text-[#0B1833]">
              {link.label}
            </a>
          ))}
          <Link
            href="/home"
            className="rounded-full bg-[#1F5EFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#154fe0]"
          >
            申し込みはこちら
          </Link>
        </nav>
      </div>
    </footer>
  );
}
