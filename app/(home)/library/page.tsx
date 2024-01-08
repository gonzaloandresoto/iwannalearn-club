'use client';

import CourseGrid from '@/components/Library/CourseGrid';

export default function Library() {
  return (
    <div className='main-page gap-8'>
      <p className='md:text-4xl text-2xl font-bold font-sourceSerif text-secondary-black md:text-center'>
        library
      </p>
      <CourseGrid />
    </div>
  );
}
