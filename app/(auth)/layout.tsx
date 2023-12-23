const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='h-screen w-screen flex items-center justify-center'>
      {children}
    </section>
  );
};

export default Layout;
