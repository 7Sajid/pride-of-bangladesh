import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pride of BD — Bangladesh Talent Atlas',
  description:
    'Discover world-renowned Bangladeshi scholars, scientists, professors, and educators who transformed the world through academic excellence and higher education.',
  keywords: [
    'Bangladesh',
    'education',
    'academic excellence',
    'scientists',
    'professors',
    'scholars',
    'pride of BD',
    'quantum physics',
    'research',
    'higher education',
  ],
  openGraph: {
    title: 'Pride of BD — Bangladesh Academic & Science Talent Atlas',
    description:
      'An interactive 3D atlas celebrating Bangladeshi scholars and educators worldwide.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <body
        style={{
          fontFamily: "'Inter', sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
