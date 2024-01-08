'use client';

import useTOCContext from '@/hooks/useTOCContext';
import useUserContext from '@/hooks/useUserContext';
import { markQuizCompleted } from '@/lib/actions/quiz.actions';
import { updateUnitStatus } from '@/lib/actions/unit.actions';

import { useRouter } from 'next/navigation';

interface QuizNavigationControlsProps {
  activePage: number;
  setActivePage: (page: number) => void;
  unitLength: number;
  courseId: string;
  unitId: string;
  quizId: string;
  selectedAnswer: string;
  correctAnswer: number;
}

export default function QuizNavigationControls({
  activePage,
  setActivePage,
  unitLength,
  courseId,
  unitId,
  quizId,
  selectedAnswer,
  correctAnswer,
}: QuizNavigationControlsProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const { wasQuizUpdated, setWasQuizUpdated } = useTOCContext();

  const handleNext = async () => {
    const userId = user?._id || '';
    if (activePage === unitLength - 1 && courseId && unitId) {
      await Promise.all([
        markQuizCompleted(quizId, userId),
        updateUnitStatus(unitId, userId, 'COMPLETE'),
      ]);
      router.push(`/course/${courseId}/${unitId}/unit-completed`);
    } else if (activePage === 1) {
      await Promise.all([
        markQuizCompleted(quizId, userId),
        updateUnitStatus(unitId, userId, 'IN_PROGRESS'),
      ]);
      setActivePage(activePage + 1);
    } else {
      await markQuizCompleted(quizId, userId);
      setActivePage(activePage + 1);
    }
    setWasQuizUpdated(!wasQuizUpdated);
  };

  return (
    <div className='w-full min-h-[88px] flex gap-2 pt-[16px] justify-end border-t-2 border-primary-tan lg:px-12 px-4'>
      <button
        onClick={() => handleNext()}
        className='main-button disabled:bg-secondary-blue'
        disabled={Number(selectedAnswer) !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
}
