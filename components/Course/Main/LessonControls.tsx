'use client';

import { useRouter } from 'next/navigation';

import useUserContext from '@/lib/hooks/useUserContext';
import { updateUnitStatus } from '@/lib/actions/unit.actions';

import { UnitLessons } from '@/types';

interface LessonControlsProps {
  lessonId: string;
  unitLessons: UnitLessons[] | undefined;
  courseId: string;
  unitId: string;
  generating: boolean;
}

export default function LessonControls({
  lessonId,
  unitLessons,
  courseId,
  unitId,
  generating,
}: LessonControlsProps) {
  const router = useRouter();
  const { user } = useUserContext();

  const currentIndex =
    unitLessons?.findIndex((lesson) => lesson._id === lessonId) ?? -1;
  const prevLessonId =
    currentIndex > 0 ? unitLessons?.[currentIndex - 1]?._id : null;
  const nextLessonId =
    currentIndex >= 0 && currentIndex < (unitLessons?.length ?? 0) - 1
      ? unitLessons?.[currentIndex + 1]._id
      : 'unit-completed';

  const handleNext = async () => {
    const userId = user?._id;

    if (userId) {
      if (nextLessonId === 'unit-completed') {
        updateUnitStatus(unitId, userId, 'COMPLETE');
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
