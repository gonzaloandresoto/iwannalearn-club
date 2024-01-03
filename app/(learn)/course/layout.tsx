import NavigationBar from '@/components/Course/CourseNavigation/NavigationBar';
import { TOCProvider } from '@/context/TOCProvider';
import { UserProvider } from '@/context/UserProvider';
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
    <UserProvider>
      <TOCProvider>
        <section className='min-h-screen min-w-screen flex flex-col grow overflow-hidden'>
          <NavigationBar />
          {children}
        </section>
      </TOCProvider>
    </UserProvider>
  );
}
