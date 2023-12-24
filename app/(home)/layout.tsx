import NavigationBar from '@/components/AppNavigation/NavigationBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='h-screen w-screen flex flex-col'>
      <NavigationBar />
      {children}
    </section>
  );
};

export default Layout;
