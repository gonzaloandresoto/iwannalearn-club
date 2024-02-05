'use client';

import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import useUserContext from '@/hooks/useUserContext';
import { updateUnitStatus } from '@/lib/actions/unit.actions';
import { useRouter } from 'next/navigation';

interface LessonNavigationControlsProps {
  activePage: number;
  unitLength: number;
  courseId: string;
  unitId: string;
}

export default function LessonNavigationControls({
  activePage,

  unitLength,
  courseId,
  unitId,
}: LessonNavigationControlsProps) {
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const { user } = useUserContext();

  const pathname = `/course/${courseId}/${unitId}`;
  const nextPageQuery = createQueryString(
    'activePage',
    (activePage + 1).toString()
  );
  const prevPageQuery = createQueryString(
    'activePage',
    (activePage - 1).toString()
  );

  const handleNext = async () => {
    const userId = user?._id;

    if (userId) {
      if (activePage === unitLength - 1) {
        await updateUnitStatus(unitId, userId, 'COMPLETE');
        router.push(`/course/${courseId}/${unitId}/unit-completed`);
      } else if (activePage === 1) {
        updateUnitStatus(unitId, userId, 'IN_PROGRESS');
        router.push(pathname + '?' + nextPageQuery);
      } else {
        router.push(pathname + '?' + nextPageQuery);
      }
    } else {
      if (activePage === unitLength - 1) {
        router.push(`/course/${courseId}/${unitId}/unit-completed`);
      } else {
        router.push(pathname + '?' + nextPageQuery);
      }
    }
  };

  const handlePrev = () => {
    if (activePage === 0) return null;
    router.push(pathname + '?' + prevPageQuery);
  };

  return (
    <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 bg-white p-[16px] justify-end border-t-2 border-primary-tan lg:px-10 px-4'>
      <button
        onClick={handlePrev}
        className='main-button disabled:opacity-50'
        disabled={activePage === 0}
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className='main-button '
      >
        Next
      </button>
    </div>
  );
}
