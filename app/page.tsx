import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <main className='w-full h-full flex flex-col items-center justify-center bg-white'>
      <div className='max-w-[720px] w-full flex flex-col items-center gap-4'>
        <p className='text-3xl text-primary-grey font-titan'>SuperMe</p>
        <SearchBar />
      </div>
    </main>
  );
}
