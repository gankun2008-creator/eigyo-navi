import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '営業ナビ | 明日電話すべき会社がわかる',
  description: '公開情報をAIが分析し、今売れそうな企業と提案内容を営業担当者に届ける営業支援サービス。',
  openGraph: {
    title: '営業ナビ | 明日、電話すべき会社がわかる。',
    description: 'AIが今売れそうな企業と提案理由を発見',
    images: [{ url: '/og.png', width: 1717, height: 915, alt: '営業ナビ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '営業ナビ | 明日、電話すべき会社がわかる。',
    description: 'AIが今売れそうな企業と提案理由を発見',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
