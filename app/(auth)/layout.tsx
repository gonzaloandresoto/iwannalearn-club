import { UserProvider } from '@/context/UserProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <section className='flex grow flex-col overflow-hidden'>
        {children}
      </section>
    </UserProvider>
  );
};

export default Layout;
