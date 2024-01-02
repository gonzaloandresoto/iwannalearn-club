import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

export default async function Create() {
  return (
    <div className='flex flex-col grow items-center justify-center gap-8 bg-tertiary-tan px-4'>
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
