import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

export default async function Create() {
  return (
    <div className='flex flex-col grow items-center gap-8 bg-white'>
      <div className='flex flex-col gap-4 items-center mt-72'>
        <p className='text-3xl text-primary-grey font-titan'>learnAnything</p>
        <SearchBar />
        <RecommendedSearches />
      </div>
    </div>
  );
}
