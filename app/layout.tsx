import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Source_Serif_4, Rosario } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif-4',
});
const rosario = Rosario({
  subsets: ['latin'],
  variable: '--font-rosario',
});

export const metadata: Metadata = {
  title: 'iWannaLearn',
  description:
    'An ai-powered learning experience for all. Generate digestable courses on the fly, similar to Duolingo or Headway.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignInUrl='/generate'
      afterSignUpUrl='/onboarding'
    >
      <html lang='en'>
        <body
          className={`${inter.className} ${sourceSerif.variable} ${rosario.variable}`}
        >
          <section className='min-w-[100dvw] min-h-[100dvh] flex grow'>
            <ToastContainer />
            {children}
            {/* <Analytics /> */}
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
