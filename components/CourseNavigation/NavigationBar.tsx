'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import useTOCContext from '@/hooks/useTOCContext';
import CourseProgress from './CourseProgress';
import TOCDropdown from './TOCDropdown';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

export default function NavigationBar() {
  const params = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { setId, tableOfContents, courseProgress } = useTOCContext();

  useEffect(() => {
    setId(params.id);
  }, []);

  return (
    <div className='top-0 relative h-[72px] w-full flex flex-row items-center justify-between px-4 md:px-32'>
      <Link
        href='/'
        className='w-[48px] h-[48px] flex-none flex items-center justify-center bg-tertiary-grey rounded-md'
      >
        ←
      </Link>

      <div className='absolute left-1/2 transform -translate-x-1/2'>
        <p className='text-xl text-primary-grey font-titan'>superMe</p>
      </div>

      <div className='flex gap-2 h-[48px]'>
        <button className='w-[48px] h-[48px] flex-none bg-primary-blue rounded-md'>
          ⭐️
        </button>
        <div
          ref={dropdownRef}
          className='relative'
        >
          <CourseProgress
            progressPercent={courseProgress}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          {isDropdownOpen && <TOCDropdown tableOfContents={tableOfContents} />}
        </div>
      </div>
    </div>
  );
}
