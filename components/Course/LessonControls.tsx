'use client';

import useUserContext from '@/hooks/useUserContext';
import { updateUnitStatus } from '@/lib/actions/unit.actions';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function LessonControls({
  lessonId,
  unitLessons,
  courseId,
  unitId,
  generating,
}: any) {
  const router = useRouter();
  const { user } = useUserContext();
  const currentIndex = unitLessons.findIndex(
    (lesson: any) => lesson._id === lessonId
  );
  const prevLessonId =
    currentIndex > 0 ? unitLessons[currentIndex - 1]._id : null;
  const nextLessonId =
    currentIndex < unitLessons.length - 1
      ? unitLessons[currentIndex + 1]._id
      : 'unit-completed';

  const handleNext = async () => {
    const userId = user?._id;

    if (userId) {
      if (nextLessonId === 'unit-completed') {
        await updateUnitStatus(unitId, userId, 'COMPLETE');
      } else if (!prevLessonId) {
        updateUnitStatus(unitId, userId, 'IN_PROGRESS');
      }
    }
    router.push(`/course/${courseId}/${unitId}/${nextLessonId}`);
  };

  const handlePrev = () => {
    if (!prevLessonId) return null;
    router.push(`/course/${courseId}/${unitId}/${prevLessonId}`);
  };

  return (
    <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 bg-white p-[16px] justify-end border-t-2 border-primary-tan lg:px-10 px-4'>
      <button
        onClick={handlePrev}
        className={`main-button disabled:opacity-50 `}
        disabled={!prevLessonId || generating}
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className={`main-button disabled:opacity-50 `}
        disabled={generating}
      >
        Next
      </button>
    </div>
  );
}
