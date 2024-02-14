'use client';

import useUserContext from '@/lib/hooks/useUserContext';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

import { Trash2 } from 'lucide-react';
import { deleteCourseById } from '@/lib/actions/course.actions';
import { usePathname } from 'next/navigation';

interface CourseDropdownProps {
  courseId: string;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
}

export default function CourseDropdown({
  courseId,
  setIsDropdownOpen,
}: CourseDropdownProps) {
  const pathname = usePathname();
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { user } = useUserContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user || !courseId) return;
    deleteCourseById(courseId, user?._id, pathname);
    setIsDropdownOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className='dropdown absolute -left-[2px] -top-[2px] '
    >
      <div className='px-4 py-2'>
        <p className='text-sm text-tertiary-black font-rosario font-bold'>
          Options
        </p>
      </div>
      <button
        onClick={handleClick}
        className='dropdown-button'
      >
        <Trash2 className='text-tertiary-black' />
        <p className='text-sm text-tertiary-black font-rosario'>Delete</p>
      </button>
    </div>
  );
}
