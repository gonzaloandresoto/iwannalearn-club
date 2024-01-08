'use client';

import useUserContext from '@/hooks/useUserContext';
import useOutsideClick from '@/hooks/useOutsideClick';
import { deleteCourseById } from '@/lib/actions/generate.actions';

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

  return (
    <div
      ref={dropdownRef}
      className='absolute lg:-left-[208px] -left-[2px] -top-[2px] lg:w-[200px] w-[144px] py-2 bg-white border-2 border-primary-tan shadow-lg rounded-sm'
    >
      <div className='px-4 py-2'>
        <p className='text-sm text-tertiary-black font-rosario font-bold'>
          Options
        </p>
      </div>
      <button
        onClick={() => deleteCourseById(courseId || '', user?._id || '')}
        className='w-full flex flex-row gap-2 px-4 py-2 items-center bg-white hover:bg-secondary-tan'
      >
        <img src='/course-icons/delete.svg' />
        <p className='text-sm font-rosario'>Delete</p>
      </button>
    </div>
  );
}
