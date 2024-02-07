import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
interface CourseGridPaginationControlsProps {
  page: number;
  handlePageChange: (direction: string) => void;
  isNext: React.MutableRefObject<boolean>;
  loading: boolean;
}

function CourseGridPaginationControls({
  page,
  handlePageChange,
  isNext,
  loading,
}: CourseGridPaginationControlsProps) {
  return (
    <div className='w-full flex flex-row gap-3 items-center justify-center pb-12'>
      <button
        disabled={page === 0}
        onClick={() => handlePageChange('prev')}
        className='flex items-center justify-center gap-2 py-1 px-3 hover:bg-tertiary-black bg-secondary-black text-tertiary-tan font-medium rounded-md disabled:bg-tertiary-black'
      >
        <ArrowLeft />
        <p>Prev</p>
      </button>
      <div className='bg-white border-2 border-primary-tan py-1 px-3 rounded-md text-secondary-black'>
        <p>{page + 1}</p>
      </div>

      <button
        disabled={!isNext.current || loading}
        onClick={() => handlePageChange('next')}
        className='flex items-center justify-center gap-2 py-1 px-3 hover:bg-tertiary-black bg-secondary-black text-tertiary-tan font-medium rounded-md disabled:bg-tertiary-black'
      >
        <p>Next</p>
        <ArrowRight />
      </button>
    </div>
  );
}

export default CourseGridPaginationControls;
