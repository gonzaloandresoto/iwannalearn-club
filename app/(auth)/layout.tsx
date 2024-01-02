import { UserProvider } from '@/context/UserProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <section className='h-screen w-screen flex items-center justify-center'>
        {children}
      </section>
    </UserProvider>
  );
};

export default Layout;
