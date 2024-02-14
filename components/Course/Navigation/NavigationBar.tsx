'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import useTOCContext from '@/lib/hooks/useTOCContext';
import CourseProgress from './CourseProgress';
import TOCDropdown from './TOCDropdown';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

export default function NavigationBar() {
  const params = useParams<{ id: string; unit: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { setId, tableOfContents, courseProgress } = useTOCContext();

  useEffect(() => {
    if (params) {
      setId(params.id);
    }
  }, []);

  let route = params && params.unit ? `/course/${params.id}` : '/library';

  return (
    <div className='z-50 min-h-[72px] w-full flex flex-row items-center justify-between px-4 lg:px-32 bg-tertiary-tan'>
      <Link
        href={route}
        className='w-[40px] h-[40px] flex-none flex items-center justify-center bg-secondary-black rounded-md'
      >
        <p className='text-tertiary-tan text-base font-bold'>←</p>
      </Link>
      <div className='flex gap-4'>
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
