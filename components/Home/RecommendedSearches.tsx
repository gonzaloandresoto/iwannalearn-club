'use client';
import { recommendedSearches } from '@/constants';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/utils';
import useUserContext from '@/hooks/useUserContext';

export default function RecommendedSearches() {
  const router = useRouter();
  const { user } = useUserContext();

  const searchRecommendedTopic = async (topic: string) => {
    try {
      if (!topic) return;
      const response = await fetch('/api/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic, userId: user?._id }),
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
    <div className='max-w-[880px] w-full flex flex-wrap md:gap-4 gap-3 justify-center'>
      {recommendedSearches.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => searchRecommendedTopic(item.topic)}
            className='flex-none px-4 py-1 bg-white border-2 border-primary-tan rounded-md text-secondary-black md:text-lg text-sm'
          >
            {item.topic}
          </button>
        );
      })}
    </div>
  );
}
