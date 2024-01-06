'use client';

import { createCourse } from '@/lib/actions/generate.actions';
import { recommendedSearches } from '@/constants';
import useUserContext from '@/hooks/useUserContext';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface RecommendedTopicsProps {
  setIsGenerating: (isGenerating: boolean) => void;
}

export default function RecommendedTopics({
  setIsGenerating,
}: RecommendedTopicsProps) {
  const router = useRouter();
  const { user } = useUserContext();

  const handleCourseCreation = async (topic: string, userId: string) => {
    if (!topic || !userId) return;

    setIsGenerating(true);
    const response = await createCourse(topic, userId);

    if ('message' in response) {
      toast(response.message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      router.push(`/course/${response.courseId}`);
    }
  };

  return (
    <div className='max-w-[880px] w-full flex flex-wrap lg:gap-4 gap-3 justify-center'>
      {recommendedSearches.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() =>
              handleCourseCreation(item?.topic || '', user?._id || '')
            }
            className='flex-none px-4 py-1 bg-white border-2 border-primary-tan rounded-md text-secondary-black md:text-base text-sm font-rosario'
          >
            {item.topic}
          </button>
        );
      })}
    </div>
  );
}
