import NavigationBar from '@/components/AppNavigation/NavigationBar';
import { UserProvider } from '@/context/UserProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <section className='h-[100dvh] w-[100dvw] overflow-hidden'>
        <NavigationBar />
        {children}
      </section>
    </UserProvider>
  );
};

export default Layout;
