import NavigationBar from '@/components/Course/CourseNavigation/NavigationBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='min-h-screen min-w-screen flex flex-col grow overflow-hidden'>
      <NavigationBar />
      {children}
    </section>
  );
}
