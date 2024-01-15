'use client';

import { useState, useEffect } from 'react';
import { FallingLines } from 'react-loader-spinner';
import { learningFunFacts } from '@/constants';

export default function GeneratingCourse() {
  const [randomFact, setRandomFact] = useState('');

  const updateFact = () => {
    const newFact =
      learningFunFacts[Math.floor(Math.random() * learningFunFacts.length)];
    setRandomFact(newFact);
  };

  useEffect(() => {
    updateFact();
    const interval = setInterval(updateFact, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center gap-8'>
      <div className='flex flex-col gap-2 items-center'>
        <FallingLines
          color='#0C54A8'
          width='100'
          visible={true}
        />
        <p className='lg:text-4xl text-2xl text-secondary-black font-bold font-rosario'>
          {`We're building your course`}
        </p>
        <p className='lg:text-lg text-base text-tertiary-black font-medium font-rosario'>
          This will take ~10s
        </p>
      </div>

      <div className='flex flex-col gap-2 max-w-[400px] w-full h-[160px] px-2 py-4 border-2 border-primary-tan rounded-md'>
        <p className='text-center text-tertiary-black font-medium font-sourceSerif'>
          Fun Learning Facts
        </p>
        <p className='text-center text-tertiary-black font-medium font-rosario'>
          {randomFact}
        </p>
      </div>
    </div>
  );
}
