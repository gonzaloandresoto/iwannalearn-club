'use client';

import { useState } from 'react';
import QuizNavigationControls from './QuizNavigationControls';

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
  activePage: number;
  setActivePage: (page: number) => void;
  unitLength: number;
  courseId: string;
}

const QuizContent: React.FC<QuizContentProps> = ({
  item,
  activePage,
  setActivePage,
  unitLength,
  courseId,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const correctAnswer = Number(item.answer);

  const parsedChoices: Choice[] =
    (item.choices && (JSON.parse(item.choices) as Choice[])) || [];

  return (
    <div className='w-full h-max flex flex-col items-center gap-8'>
      <p className='text-2xl font-bold text-left'>{item.question}</p>
      <div className='w-full h-max flex flex-col gap-2'>
        {item.choices &&
          parsedChoices.map((quizItem, index) => {
            return (
              <button
                key={index}
                onClick={() => setSelectedAnswer(quizItem.id)}
                className={`w-full px-4 py-2 border-2 border-secondary-grey rounded-md ${
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
      <QuizNavigationControls
        activePage={activePage}
        setActivePage={setActivePage}
        unitLength={unitLength}
        courseId={courseId}
        unitId={item.unitId}
        quizId={item._id}
        selectedAnswer={selectedAnswer}
        correctAnswer={correctAnswer}
      />
    </div>
  );
};

export default QuizContent;
