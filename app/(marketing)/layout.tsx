import Footer from '@/components/Marketing/Footer';
import NavigationBar from '@/components/Marketing/NavigationBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full h-[100vh] flex flex-col overflow-y-scroll'>
      <NavigationBar />
      {children}
    </section>
  );
}
