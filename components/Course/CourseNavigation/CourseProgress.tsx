'use client';

import { Dispatch, SetStateAction, useRef } from 'react';

interface CourseProgressProps {
  progressPercent: number;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CourseProgress({
  progressPercent,
  isDropdownOpen,
  setIsDropdownOpen,
}: CourseProgressProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarWidth =
    progressPercent &&
    progressBarRef.current &&
    progressBarRef.current.clientWidth * (progressPercent / 100);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
      }}
      className='h-[40px] flex items-center gap-3 px-4 bg-white rounded-md border-2 border-primary-tan cursor-pointer'
    >
      <p className='text-sm font-bold font-rosario text-black'>Progress</p>
      <div
        ref={progressBarRef}
        className='w-[120px] h-[10px] bg-primary-tan rounded-sm'
      >
        <div
          style={{ width: `${progressBarWidth}px` }}
          className='h-full bg-primary-blue'
        ></div>
      </div>
      <p className='text-sm font-bold font-rosario text-black'>
        {progressPercent || 0}%
      </p>
    </button>
  );
}
