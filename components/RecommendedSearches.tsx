import { recommendedSearches } from '@/constants/index';

export default function RecommendedSearches() {
  return (
    <div className='max-w-[880px] flex flex-wrap gap-4 justify-center'>
      {recommendedSearches.map((item) => {
        return (
          <button className='flex-none px-4 py-1 border border-2 border-secondary-grey rounded-md'>
            {item.term}
          </button>
        );
      })}
    </div>
  );
}
