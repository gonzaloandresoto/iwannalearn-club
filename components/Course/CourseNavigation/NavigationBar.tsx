'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import useTOCContext from '@/hooks/useTOCContext';
import CourseProgress from './CourseProgress';
import TOCDropdown from './TOCDropdown';
import useOutsideClick from '@/lib/hooks/useOutsideClick';
import Image from 'next/image';

export default function NavigationBar() {
  const params = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { setId, tableOfContents, courseProgress } = useTOCContext();

  useEffect(() => {
    setId(params.id);
  }, []);

  return (
    <div className='relative h-[72px] w-full flex flex-row items-center justify-between px-4 lg:px-32 bg-tertiary-tan'>
      <Link
        href='/library'
        className='w-[40px] h-[40px] flex-none flex items-center justify-center bg-secondary-black rounded-md'
      >
        <p className='text-tertiary-tan text-base font-bold'>←</p>
      </Link>

      <div className='flex gap-4'>
        <button className='hidden w-[40px] h-[40px] flex-none md:flex items-center justify-center bg-secondary-black rounded-md'>
          <Image
            src='/course-icons/more-white.svg'
            alt='more icon'
            width={18}
            height={4}
          />
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
