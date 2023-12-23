import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

export default async function Page() {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4 bg-white'>
      <p className='text-3xl text-primary-grey font-titan'>learnAnything</p>

      <SearchBar />
      <RecommendedSearches />
    </div>
  );
}
