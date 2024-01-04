'use client';

import { useState } from 'react';
import QuizNavigationControls from './QuizNavigationControls';
import Image from 'next/image';

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
    <div className='w-full h-full flex flex-col'>
      <div className='w-full h-full flex flex-col items-center gap-8 lg:pt-16 pt-12 lg:px-12 px-4'>
        <p className='lg:text-4xl text-2xl text-center font-bold font-sourceSerif text-secondary-black'>
          {item.question}
        </p>
        <div className='w-full h-full flex flex-col gap-2'>
          {item.choices &&
            parsedChoices.map((quizItem, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(quizItem.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 border-2 border-secondary-grey rounded-md ${
                    quizItem.id === selectedAnswer
                      ? 'bg-primary-blue text-tertiary-tan'
                      : 'bg-secondary-tan text-secondary-black border-primary-tan'
                  }`}
                >
                  <p className='text-lg text-left font-rosario'>
                    {quizItem.option}
                  </p>
                  <Image
                    src={
                      quizItem.id === selectedAnswer
                        ? '/course-icons/selected.svg'
                        : '/course-icons/uncompleted.svg'
                    }
                    width={24}
                    height={24}
                    alt='check'
                  />
                </button>
              );
            })}
        </div>
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
