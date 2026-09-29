import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Smart Scheme Recommender - Scheme for your benefit',
  description: 'AI-driven scheme recommender and concessional credit portal - Scheme for your benefit.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Smart Scheme Recommender - Scheme for your benefit',
    description: 'AI-driven scheme recommender and concessional credit portal - Scheme for your benefit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Scheme Recommender - Scheme for your benefit',
    description: 'AI-driven scheme recommender and concessional credit portal - Scheme for your benefit.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
