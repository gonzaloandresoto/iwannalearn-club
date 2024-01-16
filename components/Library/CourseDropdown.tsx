'use client';

import useUserContext from '@/hooks/useUserContext';
import useOutsideClick from '@/hooks/useOutsideClick';
import { deleteCourseById } from '@/lib/actions/generate.actions';
import { Trash2 } from 'lucide-react';

interface CourseDropdownProps {
  courseId: string;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
}

export default function CourseDropdown({
  courseId,
  setIsDropdownOpen,
}: CourseDropdownProps) {
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const { user } = useUserContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteCourseById(courseId || '', user?._id || '');
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
