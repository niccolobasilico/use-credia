import '#/styles/globals.css';

import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'UseCredia Platform',
    template: '%s | UseCredia Platform',
  },
  description:
    'Piattaforma interna multi-ruolo per la gestione dei crediti UseCredia: dashboard, pratiche, clienti e tool di qualifica.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="bg-gray-950 text-gray-100">
      <body
        className={`min-h-screen bg-gray-950 font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
