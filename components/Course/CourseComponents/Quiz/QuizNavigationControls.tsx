'use client';

import useTOCContext from '@/hooks/useTOCContext';
import { markQuizCompleted } from '@/lib/actions/quiz.actions';
import { updateUnitStatus } from '@/lib/courseServices';
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
  const { wasQuizUpdated, setWasQuizUpdated } = useTOCContext();

  const handleNext = () => {
    if (activePage === unitLength - 1 && courseId && unitId) {
      router.push(`/course/${courseId}/${unitId}/unit-completed`);
    }
    setActivePage(activePage + 1);
  };

  const continueClick = async () => {
    setWasQuizUpdated(!wasQuizUpdated);
    handleNext();
    await markQuizCompleted(quizId);
    await updateUnitStatus(unitId);
  };
  return (
    <div className='w-full min-h-[88px] flex gap-2 pt-[16px] justify-end border-t-2 border-primary-tan lg:px-12 px-4'>
      <button
        onClick={() => continueClick()}
        className='main-button disabled:bg-secondary-blue'
        disabled={Number(selectedAnswer) !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
}
