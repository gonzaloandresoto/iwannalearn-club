import { TOCProvider } from '@/context/TOCProvider';
import { UserProvider } from '@/context/UserProvider';
import NavigationBar from '@/components/Course/CourseNavigation/NavigationBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <TOCProvider>
        <section className='flex grow flex-col overflow-hidden'>
          <NavigationBar />
          {children}
        </section>
      </TOCProvider>
    </UserProvider>
  );
}
