'use client';
import { recommendedSearches } from '@/constants';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/utils';

export default function RecommendedSearches() {
  const router = useRouter();

  const searchRecommendedTopic = async (topic: string) => {
    try {
      if (!topic) return;
      const response = await fetch('/api/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic }),
      });

      const data = await response.json();
      if (data) {
        router.push(`/course/${data}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='max-w-[880px] flex flex-wrap gap-4 justify-center'>
      {recommendedSearches.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => searchRecommendedTopic(item.topic)}
            className='flex-none px-4 py-1 border-2 border-secondary-grey rounded-md'
          >
            {item.topic}
          </button>
        );
      })}
    </div>
  );
}
