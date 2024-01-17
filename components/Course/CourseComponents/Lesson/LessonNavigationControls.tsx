'use client';

import useUserContext from '@/hooks/useUserContext';
import { updateUnitStatus } from '@/lib/actions/unit.actions';
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
  const { user } = useUserContext();

  const handleNext = async () => {
    if (activePage === unitLength - 1 && courseId && unitId) {
      await updateUnitStatus(unitId, user?._id || '', 'COMPLETE'),
        router.push(`/course/${courseId}/${unitId}/unit-completed`);
    }
    setActivePage(activePage + 1);
  };
  const handlePrev = () => {
    if (activePage === 0) return null;
    setActivePage(activePage - 1);
  };

  return (
    <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 bg-white p-[16px] justify-end border-t-2 border-primary-tan lg:px-10 px-4'>
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
