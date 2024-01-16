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
        <section className='w-full h-[100vh] flex flex-col'>
          <NavigationBar />
          {children}
        </section>
      </TOCProvider>
    </UserProvider>
  );
}
