import RecommendedSearches from '@/components/RecommendedSearches';
import SearchBar from '@/components/SearchBar';

export default async function Home() {
  return (
    <main className='w-full h-full flex flex-col items-center justify-center gap-4 bg-white'>
      <p className='text-3xl text-primary-grey font-titan'>learnAnything</p>

      <SearchBar />

      <RecommendedSearches />
    </main>
  );
}
