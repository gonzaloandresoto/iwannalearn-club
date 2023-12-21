'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import useTOCContext from '@/hooks/useTOCContext';
import CourseProgress from './CourseProgress';
import TableOfContentsDropdown from './TableofContentsDropdown';
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
    <div className='fixed top-0 relative w-4/5 flex items-center justify-center h-[96px]'>
      <button className='absolute left-0 w-[48px] h-[48px] flex-none bg-tertiary-grey rounded-md'>
        <Link href='/'>←</Link>
      </button>

      <p className='text-xl text-primary-grey font-titan'>superMe</p>

      <div className='absolute right-0 flex gap-2 h-[48px]'>
        <button className='w-[48px] h-[48px] flex-none bg-primary-blue rounded-md'>
          ⭐️
        </button>
        <div className='relative'>
          <CourseProgress
            progressPercent={courseProgress}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          {isDropdownOpen && (
            <TableOfContentsDropdown
              tableOfContents={tableOfContents}
              dropdownRef={dropdownRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}
