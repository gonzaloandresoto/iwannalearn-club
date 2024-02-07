'use client';

import { MoreHorizontal } from 'lucide-react';
import CourseDropdown from './CourseDropdown';
import { useState } from 'react';

interface CourseCardHandleProps {
  courseId: string;
}
export default function CourseCardHandle({ courseId }: CourseCardHandleProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div className='relative h-[32px] w-[144px] flex flex-col justify-center bg-white px-2 border-b-0 border-2 border-primary-tan'>
      <button
        className='w-[20px] h-[20px] flex items-center justify-center'
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <MoreHorizontal />
      </button>

      {isDropdownOpen && (
        <CourseDropdown
          courseId={courseId}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      )}
    </div>
  );
}
