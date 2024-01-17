import Footer from '@/components/Marketing/Footer';
import NavigationBar from '@/components/Marketing/NavigationBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex grow flex-col'>
      <NavigationBar />
      {children}
    </section>
  );
}
