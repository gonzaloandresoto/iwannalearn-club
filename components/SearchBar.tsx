'use client';

import { createCourse } from '@/lib/actions/course.actions';
import { handleError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SearchBar() {
  const router = useRouter();
  const [topic, setTopic] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSubmit = async () => {
    try {
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
        onClick={handleSubmit}
        className='h-[40px] px-4 text-white bg-primary-blue rounded-md'
      >
        Create
      </button>
    </div>
  );
}

export default SearchBar;
