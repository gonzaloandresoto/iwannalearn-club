import NavigationBar from '@/components/Shared/Navigation/NavigationBar';
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
