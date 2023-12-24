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
  const { updatedQuizId, setUpdatedQuizId } = useTOCContext();

  const handleNext = () => {
    if (activePage === unitLength - 1 && courseId && unitId) {
      router.push(`/${courseId}/${unitId}/completed`);
    }
    setActivePage(activePage + 1);
  };

  const continueClick = async () => {
    await markQuizCompleted(quizId);
    setUpdatedQuizId(!updatedQuizId);
    await updateUnitStatus(unitId);
    handleNext();
  };
  return (
    <div>
      <button
        onClick={() => continueClick()}
        className='fixed bottom-16 main-button disabled:bg-secondary-blue'
        disabled={Number(selectedAnswer) !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
}
