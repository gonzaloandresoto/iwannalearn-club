'use client';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/utils';

export default function Generate() {
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const createCourse = async (topic: string, userId: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic, userId: userId }),
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
    <div className='main-page justify-center'>
      {isGenerating ? (
        <GeneratingCourse />
      ) : (
        <div className='flex flex-col gap-4 items-center justify-center'>
          <p className='md:text-5xl text-3xl text-secondary-black font-sourceSerif'>
            iwanna<span className='font-bold italic'>learn</span>
          </p>
          <SearchBar createCourse={createCourse} />
          <RecommendedSearches />
        </div>
      )}
    </div>
  );
}
