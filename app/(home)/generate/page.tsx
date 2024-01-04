'use client';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedSearches from '@/components/Home/RecommendedSearches';
import SearchBar from '@/components/Home/SearchBar';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        if (data.message) {
          toast(data.message, {
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
          router.push(`/course/${data}`);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='main-page justify-center'>
      <ToastContainer />
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
