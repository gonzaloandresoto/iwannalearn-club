'use client';

interface SearchBarProps {
  setIsGenerating: (isGenerating: boolean) => void;
}

import useUserContext from '@/hooks/useUserContext';
import { createCourse } from '@/lib/actions/generate.actions';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function SearchBar({ setIsGenerating }: SearchBarProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const [topic, setTopic] = useState<string>('');

  const handleCourseCreation = async (
    e: React.MouseEvent<HTMLButtonElement>,
    topic: string,
    userId: string
  ) => {
    e.preventDefault();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <form className='max-w-[720px] w-full md:h-[64px] flex items-center px-2 py-2 bg-white border-2 border-primary-tan rounded-md'>
      <input
        type='text'
        value={topic}
        onChange={handleChange}
        placeholder='Where will your curiosity lead?'
        className='w-full h-full bg-white outline-none md:text-lg text-base placeholder:text-secondary-black font-rosario'
      />
      <button
        onClick={(e) => handleCourseCreation(e, topic || '', user?._id || '')}
        className='md:h-[48px] flex flex-row items-center gap-2 px-4 py-2 text-tertiary-tan md:text-xl bg-secondary-black rounded-sm font-rosario'
      >
        <Sparkles className='md:w-[20px] w-[16px]' />
        Generate
      </button>
    </form>
  );
}
