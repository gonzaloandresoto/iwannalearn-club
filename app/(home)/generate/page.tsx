'use client';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedTopics from '@/components/Home/RecommendedTopics';
import SearchBar from '@/components/Home/SearchBar';
import { useState } from 'react';

export default function Generate() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  return (
    <div className='main-page justify-center'>
      {isGenerating ? (
        <GeneratingCourse />
      ) : (
        <div className='flex flex-col gap-4 items-center justify-center'>
          <p className='md:text-5xl text-3xl text-secondary-black font-bold font-sourceSerif'>
            iWanna<span className=''>Learn</span>
          </p>
          <SearchBar setIsGenerating={setIsGenerating} />
          <RecommendedTopics setIsGenerating={setIsGenerating} />
        </div>
      )}
    </div>
  );
}
