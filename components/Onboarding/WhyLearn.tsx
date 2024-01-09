'use client';

import Image from 'next/image';
import { useState } from 'react';

const whyLearnOptions = [
  'Using AI to supplement my education',
  'Staying productive with my free time',
  'Receiving personalized learning paths based on my interests',
  'Learning on a flexible schedule that suits my lifestyle',
  'Other',
];

interface AttributionProps {
  setUserInfo: (userInfo: any) => void;
}

export default function WhyLearn({ setUserInfo }: AttributionProps) {
  const [buttonSelected, setButtonSelected] = useState<string>('');

  const handleClick = (option: string) => {
    setButtonSelected(option);
    setUserInfo((prev: any) => ({
      ...prev,
      whyLearn: option,
    }));
  };

  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 font-rosario text-center'>
        What are you most excited about?
      </p>
      <div className='lg:w-[640px] w-full flex flex-col gap-2'>
        {whyLearnOptions?.map((option) => (
          <button
            key={option}
            className={`option-button ${
              buttonSelected === option
                ? '!bg-primary-blue !text-tertiary-tan'
                : ''
            }`}
            onClick={() => handleClick(option)}
          >
            {option}
            <Image
              src={
                buttonSelected === option
                  ? '/course-icons/selected.svg'
                  : '/course-icons/uncompleted.svg'
              }
              width={24}
              height={24}
              alt='check'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
