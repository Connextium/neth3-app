import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neth3 — A Payment Frontier',
  description: 'Instant global settlement across 180+ countries connecting fiat rails, regulated stablecoins, and major cryptocurrencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}