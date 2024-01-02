'use client';

import useUserContext from '@/hooks/useUserContext';
import { handleError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function SearchBar() {
  const { user } = useUserContext();
  const router = useRouter();
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <form className='max-w-[720px] w-full md:h-[64px] flex items-center px-2 py-2 border-2 border-primary-tan rounded-md font-rosario'>
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

export default SearchBar;
