'use client';

import useTOCContext from '@/hooks/useTOCContext';
import { markQuizCompleted, updateUnitStatus } from '@/lib/courseServices';
import { useState } from 'react';

interface Choice {
  id: string;
  option: string;
}

interface Content {
  _id: string;
  question?: string;
  choices?: string;
  answer?: string;
  unitId: string;
}

interface QuizContentProps {
  item: Content;
  handleNext: () => void;
}

const QuizContent: React.FC<QuizContentProps> = ({ item, handleNext }) => {
  const { updatedQuizId, setUpdatedQuizId } = useTOCContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const correctAnswer = item.answer;

  const parsedChoices: Choice[] =
    (item.choices && (JSON.parse(item.choices) as Choice[])) || [];

  const continueClick = async () => {
    await markQuizCompleted(item._id);
    setUpdatedQuizId(!updatedQuizId);
    await updateUnitStatus(item.unitId);
    handleNext();
  };

  return (
    <div className='w-full h-max flex flex-col items-center gap-8'>
      <p className='text-2xl font-bold text-left'>{item.question}</p>
      <div className='w-full h-max flex flex-col gap-2'>
        {item.choices &&
          parsedChoices.map((quizItem, index) => {
            return (
              <button
                key={index}
                onClick={() => setSelectedAnswer(quizItem.id || '')}
                className={`w-full px-4 py-2 border border-2 border-secondary-grey rounded-md ${
                  quizItem.id === selectedAnswer
                    ? 'bg-primary-orange text-white'
                    : 'bg-white text-black'
                }`}
              >
                <p className='text-lg text-left'>{quizItem.option}</p>
              </button>
            );
          })}
      </div>
      <button
        onClick={continueClick}
        className='fixed bottom-16 main-button disabled:bg-secondary-blue'
        disabled={selectedAnswer !== correctAnswer}
      >
        Continue
      </button>
    </div>
  );
};

export default QuizContent;
