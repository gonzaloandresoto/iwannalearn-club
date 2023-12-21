import type { Metadata } from 'next';
import { Inter, Titan_One } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });
const titanOne = Titan_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-titan-one',
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
        <body className={`${inter.className} ${titanOne.variable}`}>
          <section className='h-screen w-screen'>{children}</section>
        </body>
      </html>
    </ClerkProvider>
  );
}
