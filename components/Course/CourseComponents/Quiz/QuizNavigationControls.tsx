'use client';

import { useRouter } from 'next/navigation';
import useTOCContext from '@/hooks/useTOCContext';
import useUserContext from '@/hooks/useUserContext';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';

import { markQuizCompleted } from '@/lib/actions/quiz.actions';
import { updateUnitStatus } from '@/lib/actions/unit.actions';

interface QuizNavigationControlsProps {
  activePage: number;
  unitLength: number;
  courseId: string;
  unitId: string;
  quizId: string;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  correctAnswer: number;
}

export default function QuizNavigationControls({
  activePage,
  unitLength,
  courseId,
  unitId,
  quizId,
  selectedAnswer,
  setSelectedAnswer,
  correctAnswer,
}: QuizNavigationControlsProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const createQueryString = useCreateQueryString();
  const userId = user?._id;

  // const { wasQuizUpdated, setWasQuizUpdated } = useTOCContext();

  const pathname = `/course/${courseId}/${unitId}`;
  const nextPage = (activePage + 1).toString();
  const nextPageQuery = createQueryString('activePage', nextPage);

  // const handleNext = async () => {
  //   if (activePage === unitLength - 1 && courseId && unitId) {
  //     if (userId) markQuizCompleted(quizId, userId);

  //     router.push(`/course/${courseId}/${unitId}/unit-completed`);
  //   } else if (activePage === 1 && userId) {
  //     updateUnitStatus(unitId, userId, 'IN_PROGRESS');
  //   }
  //   setSelectedAnswer('');
  //   setWasQuizUpdated(!wasQuizUpdated);
  //   router.push(pathname + '?' + nextPageQuery);
  // };

  return (
    <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 pt-[16px] justify-end border-t-2 border-primary-tan lg:px-10 px-4'>
      <button
        onClick={() => console.log('prev')}
        className='main-button disabled:bg-secondary-blue'
        disabled={Number(selectedAnswer) !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
}
