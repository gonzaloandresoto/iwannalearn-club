'use client';

import { CheckCircle2, Circle } from 'lucide-react';

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
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
}

const QuizContent: React.FC<QuizContentProps> = ({
  item,
  selectedAnswer,
  setSelectedAnswer,
}) => {
  const parsedChoices: Choice[] =
    (item.choices && (JSON.parse(item.choices) as Choice[])) || [];

  return (
    <div className='lesson-quiz-content'>
      <div className='w-full h-full flex flex-col items-center gap-8'>
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
                  className={`group w-full flex items-center justify-between px-4 py-2 border-2 rounded-md ${
                    quizItem.id === selectedAnswer
                      ? 'bg-primary-blue text-tertiary-tan'
                      : 'bg-tertiary-tan hover:bg-secondary-tan text-secondary-black border-primary-tan'
                  }`}
                >
                  <p className='text-lg text-left font-rosario'>
                    {quizItem.option}
                  </p>

                  {quizItem.id === selectedAnswer ? (
                    <CheckCircle2 className='flex-none min-w-[24px] text-tertiary-tan' />
                  ) : (
                    <Circle className='w-[24px] text-primary-tan group-hover:text-tertiary-black' />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default QuizContent;
