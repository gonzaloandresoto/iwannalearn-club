'use client';

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

interface InputBarProps {
  setCustomizeDrawer: (customizeDrawer: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export default function InputBar({
  setCustomizeDrawer,
  topic,
  setTopic,
}: InputBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (topic.length === 0) {
      e.preventDefault();
      toast.error('Please enter a topic to search for.', {
        position: 'top-center',
      });
    } else {
      e.preventDefault();
      setCustomizeDrawer(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-[720px] w-full md:h-[64px] flex items-center px-2 py-2 bg-white border-2 border-primary-tan rounded-md '
    >
      <input
        type='text'
        value={topic}
        onChange={handleChange}
        placeholder='Where will your curiosity lead?'
        className='w-full h-full bg-white outline-none md:text-lg text-base placeholder:text-tertiary-black font-rosario pr-4'
      />
      <button
        type='submit'
        className='md:h-[48px] flex flex-row items-center gap-2 px-4 py-2 text-tertiary-tan md:text-xl bg-secondary-black hover:bg-tertiary-black rounded-md font-rosario'
      >
        <Sparkles className='md:w-[20px] w-[16px]' />
        <p className='sm:block hidden'>Generate</p>
      </button>
    </form>
  );
}
