import NavigationBar from '@/components/CourseNavigation/NavigationBar';
import { TOCProvider } from '@/context/TOCProvider';
import type { Metadata } from 'next';

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
    <TOCProvider>
      <section className='h-screen w-screen flex flex-col items-center'>
        <NavigationBar />

        {children}
      </section>
    </TOCProvider>
  );
}
