'use client';

import useTOCContext from '@/hooks/useTOCContext';
import useUserContext from '@/hooks/useUserContext';
import { markQuizCompleted } from '@/lib/actions/quiz.actions';
import {
  getNextUncompletedUnit,
  updateUnitStatus,
} from '@/lib/actions/unit.actions';
import next from 'next';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface QuizNavigationControlsProps {
  activePage: number;
  setActivePage: (page: number) => void;
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
  setActivePage,
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
  const { wasQuizUpdated, setWasQuizUpdated } = useTOCContext();
  const [nextUnit, setNextUnit] = useState<string | null>(null);

  useEffect(() => {
    const getNextUnit = async () => {
      const nextUnitId = await getNextUncompletedUnit(courseId);
      setNextUnit(nextUnitId || null);
    };
    getNextUnit();
  }, [wasQuizUpdated]);

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
    setNextUnit(null);
    setSelectedAnswer('');
    setWasQuizUpdated(!wasQuizUpdated);
  };

  return (
    <div className='fixed bottom-0 max-w-[876px] w-full min-h-[88px] flex gap-2 pt-[16px] justify-end border-t-2 border-primary-tan lg:px-10 px-4'>
      <button
        onClick={handleNext}
        className='main-button disabled:bg-secondary-blue'
        disabled={Number(selectedAnswer) !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
}
