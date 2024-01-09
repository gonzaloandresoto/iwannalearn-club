'use client';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedTopics from '@/components/Home/RecommendedTopics';
import SearchBar from '@/components/Home/SearchBar';
import useUserContext from '@/hooks/useUserContext';
import { getMostRecentCourse } from '@/lib/actions/generate.actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Generate() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { user } = useUserContext();

  useEffect(() => {
    if (!isGenerating) return;

    const timer = setTimeout(async () => {
      const data = await getMostRecentCourse(user?._id || '');
      if (data?.courseId) {
        router.push(`/course/${data.courseId}`);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isGenerating]);

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
