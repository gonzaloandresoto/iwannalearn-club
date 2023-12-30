'use client';

import Link from 'next/link';
import { useState } from 'react';
import CourseDropdown from './CourseDropdown';

interface CourseCardProps {
  title: string;
  summary: string;
  courseId: string;
}

export default function CourseCard({
  title,
  summary,
  courseId,
}: CourseCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  return (
    <div className='relative'>
      <a
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className='absolute top-4 right-4 w-[20px] h-[20px] flex items-center justify-center cursor-pointer'
      >
        <div className='relative'>
          <img src='/course-icons/more.svg' />
          {isDropdownOpen && (
            <CourseDropdown
              courseId={courseId}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          )}
        </div>
      </a>

      <Link
        className='w-full flex flex-col gap-4 px-4 py-4 bg-tertiary-grey rounded-xl'
        href={`/course/${courseId}`}
      >
        <p className='text-lg font-semibold'>{title}</p>
        <p>{summary}</p>
      </Link>
    </div>
  );
}
