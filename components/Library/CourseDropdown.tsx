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
      body: JSON.stringify({ courseId: courseId, userId: user?._id }),
    }).then((response) => response.json());
  };
  return (
    <div
      ref={dropdownRef}
      className='absolute sm:-left-[208px] w-[200px] top-0 py-2 bg-white border-2 border-secondary-grey shadow-lg rounded-md'
    >
      <button
        onClick={() => deleteCourse()}
        className='w-full flex flex-row gap-2 px-4 py-2 items-center bg-white hover:bg-secondary-tan'
      >
        <img src='/course-icons/delete.svg' />
        <p className='text=sm'>Delete</p>
      </button>
    </div>
  );
}
