import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

export default async function Generate() {
  return (
    <div className='main-page justify-center'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <p className='md:text-5xl text-3xl text-secondary-black font-sourceSerif'>
          iwanna<span className='font-bold italic'>learn</span>
        </p>
        <SearchBar />
        <RecommendedSearches />
      </div>
    </div>
  );
}
