import type { Metadata } from 'next';
import { Inter, Titan_One, Source_Serif_4, Rosario } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });
const titanOne = Titan_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-titan-one',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
});
const rosario = Rosario({
  subsets: ['latin'],
  variable: '--font-rosario',
});

export const metadata: Metadata = {
  title: 'smartMe',
  description: 'An ai-powered learning experience for all.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${inter.className} ${titanOne.variable} ${sourceSerif.variable} ${rosario.variable}`}
        >
          <section className='min-h-screen min-w-screen flex grow'>
            {children}
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
