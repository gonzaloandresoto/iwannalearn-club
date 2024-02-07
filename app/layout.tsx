import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LogSnagProvider } from '@logsnag/next';
import { Analytics } from '@vercel/analytics/react';
import { Inter, Source_Serif_4, Rosario } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import Feedback from '@/components/Shared/Feedback';
import { UserProvider } from '@/context/UserProvider';

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
  description: `iWannaLearn is an AI-powered learning platform where you can generate courses with artificial intelligence and talk to an AI tutor. Whether you're passionate about history, celebrities sciences, or anything in between, our platform tailors content to your preferences, making education fun, engaging and efficient.`,
  twitter: {
    images: '/twitter-image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <LogSnagProvider
          token='5709588006ef4f56b1a4ab66bf426905'
          project='iwl'
        />
      </head>
      <body
        className={`${inter.className} ${sourceSerif.variable} ${rosario.variable}`}
      >
        <section className='min-w-screen min-h-screen flex'>
          <ClerkProvider
            afterSignInUrl='/'
            afterSignUpUrl='/onboarding'
          >
            <SpeedInsights />
            <ToastContainer />
            {children}
            <UserProvider>
              <Feedback />
            </UserProvider>
            <Analytics />
          </ClerkProvider>
        </section>
      </body>
    </html>
  );
}
