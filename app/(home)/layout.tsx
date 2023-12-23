import NavigationBar from '@/components/Home/NavigationBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='h-screen w-screen flex flex-col'>
      <NavigationBar />
      {children}
    </section>
  );
};

export default Layout;
