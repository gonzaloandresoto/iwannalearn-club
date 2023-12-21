'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';

import useTOCContext from '@/hooks/useTOCContext';
import CourseProgress from './CourseProgress';
import TableOfContentsDropdown from './TableofContentsDropdown';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

export default function NavigationBar() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { setId, tableOfContents, courseProgress } = useTOCContext();

  useEffect(() => {
    setId(params.id);
  }, []);

  const returnHome = () => {
    router.push('/');
  };

  return (
    <div className='fixed top-0 relative w-4/5 flex items-center justify-center h-[96px]'>
      <button
        onClick={returnHome}
        className='absolute left-0 w-[48px] h-[48px] flex-none bg-tertiary-grey rounded-md'
      >
        ←
      </button>

      <p className='text-xl text-primary-grey font-titan'>superMe</p>

      <div className='absolute right-0 flex gap-2 h-[48px]'>
        <button className='w-[48px] h-[48px] flex-none bg-primary-blue rounded-md'>
          ⭐️
        </button>
        <div className='relative'>
          <CourseProgress
            progressPercent={courseProgress}
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
