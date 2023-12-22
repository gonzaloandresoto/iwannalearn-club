'use client';

import useCommandEnter from '@/lib/hooks/useCommandEnter';
import { handleError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function SearchBar() {
  const router = useRouter();
  const [topic, setTopic] = useState('');

  useCommandEnter(() => handleSubmit(), topic);

  const handleSubmit = async () => {
    console.log('submitting');
    try {
      if (!topic) return;
      const response = await fetch('/api/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic }),
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
    <div className='max-w-[720px] w-full h-[56px] flex items-center px-2 border border-2 border-secondary-grey rounded-md'>
      <input
        type='text'
        value={topic}
        onChange={handleChange}
        placeholder='What would you like to learn about?'
        className='w-full h-full bg-white outline-none placeholder:text-primary-grey'
      />
      <button
        onClick={() => handleSubmit()}
        className='h-[40px] px-4 text-white bg-primary-blue rounded-md'
      >
        Create
      </button>
    </div>
  );
}

export default SearchBar;
