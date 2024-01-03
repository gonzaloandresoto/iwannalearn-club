'use client';

interface SearchBarProps {
  createCourse: (topic: string, userId: string) => Promise<void>;
}

import useUserContext from '@/hooks/useUserContext';
import React, { useState } from 'react';

export default function SearchBar({ createCourse }: SearchBarProps) {
  const { user } = useUserContext();
  const [topic, setTopic] = useState<string>('');

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!topic || !user) return;
    e.preventDefault();
    createCourse(topic, user?._id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <form className='max-w-[720px] w-full md:h-[64px] flex items-center px-2 py-2 bg-white border-2 border-primary-tan rounded-md font-rosario'>
      <input
        type='text'
        value={topic}
        onChange={handleChange}
        placeholder='Where will your curiosity lead?'
        className='w-full h-full bg-white outline-none md:text-lg text-base placeholder:text-secondary-black'
      />
      <button
        onClick={(e) => handleSubmit(e)}
        className='md:h-[48px] px-4 py-2 text-tertiary-tan md:text-xl bg-secondary-black rounded-md'
      >
        Generate
      </button>
    </form>
  );
}
