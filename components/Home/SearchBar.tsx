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
        router.push(`/${data}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <form className='max-w-[720px] w-full h-[56px] flex items-center px-2 border-2 border-secondary-grey rounded-md'>
      <input
        type='text'
        value={topic}
        onChange={handleChange}
        placeholder='What would you like to learn about?'
        className='w-full h-full bg-white outline-none placeholder:text-primary-grey'
      />
      <button
        onClick={(e) => handleSubmit(e)}
        className='h-[40px] px-4 text-white bg-primary-blue rounded-md'
      >
        Create
      </button>
    </form>
  );
}

export default SearchBar;
