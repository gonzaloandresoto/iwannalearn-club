'use client';

import { useRouter } from 'next/navigation';

interface LessonNavigationControlsProps {
  activePage: number;
  setActivePage: (page: number) => void;
  unitLength: number;
  courseId: string;
  unitId: string;
}

export default function LessonNavigationControls({
  activePage,
  setActivePage,
  unitLength,
  courseId,
  unitId,
}: LessonNavigationControlsProps) {
  const router = useRouter();

  const handleNext = () => {
    if (activePage === unitLength - 1 && courseId && unitId) {
      router.push(`/${courseId}/${unitId}/completed`);
    }
    setActivePage(activePage + 1);
  };
  const handlePrev = () => {
    if (activePage === 0) return null;
    setActivePage(activePage - 1);
  };

  return (
    <div className='fixed bottom-16 flex gap-2'>
      <button
        onClick={() => handlePrev()}
        className='main-button disabled:opacity-50'
        disabled={activePage === 0}
      >
        Prev
      </button>
      <button
        onClick={() => handleNext()}
        className='main-button '
      >
        Next
      </button>
    </div>
  );
}
