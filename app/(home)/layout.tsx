import NavigationBar from '@/components/AppNavigation/NavigationBar';
import { UserProvider } from '@/context/UserProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <section className='flex grow flex-col'>
        <NavigationBar />
        {children}
      </section>
    </UserProvider>
  );
};

export default Layout;
