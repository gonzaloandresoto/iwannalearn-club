'use client';

import useUserContext from '@/hooks/useUserContext';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

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

  const deleteCourse = async () => {
    fetch('/api/course-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId: courseId, userId: user._id }),
    }).then((response) => response.json());
  };
  return (
    <div
      ref={dropdownRef}
      className='absolute right-0 my-2 w-[200px] py-2 px-2 bg-white border border-secondary-grey shadow-sm rounded-lg'
    >
      <button
        onClick={() => deleteCourse()}
        className='w-full flex flex-row gap-2 px-2 py-1 items-center bg-white hover:bg-tertiary-grey rounded-md'
      >
        <img src='/course-icons/delete.svg' />
        <p className='text=sm'>Delete</p>
      </button>
    </div>
  );
}
