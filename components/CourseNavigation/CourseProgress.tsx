'use client';

import { Dispatch, SetStateAction } from 'react';

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
  const progressBarWidth = progressPercent && 88 * (progressPercent / 100);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
      }}
      className='h-[48px] flex items-center gap-3 px-4 bg-tertiary-grey rounded-md cursor-pointer'
    >
      <p className='text-sm font-medium text-black'>Course Progress</p>
      <div className='w-[88px] h-[10px] bg-white border border-secondary-grey rounded-full'>
        <div
          style={{ width: `${progressBarWidth}px` }}
          className='h-full bg-primary-blue rounded-full'
        ></div>
      </div>
      <p className='text-sm font-medium text-black'>{progressPercent || 0}%</p>
    </button>
  );
}
