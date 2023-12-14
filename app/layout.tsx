import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang='en'>
      <link
        href='https://fonts.googleapis.com/css2?family=Titan+One&display=swap'
        rel='stylesheet'
      />
      <body className={inter.className}>
        <section className='h-screen w-screen'>{children}</section>
      </body>
    </html>
  );
}
