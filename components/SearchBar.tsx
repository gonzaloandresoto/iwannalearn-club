'use client';

import { createCourse } from '@/lib/actions/course.actions';
import React from 'react';

function SearchBar() {
  const [topic, setTopic] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSubmit = () => {
    createCourse(topic);
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
