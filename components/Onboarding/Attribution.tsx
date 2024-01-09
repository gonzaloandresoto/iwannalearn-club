'use client';

import Image from 'next/image';
import { useState } from 'react';

const attributionOptions = [
  'Google',
  'Instagram',
  'Twitter',
  'LinkedIn',
  'Word of Mouth',
  'Other',
];

interface AttributionProps {
  setUserInfo: (userInfo: any) => void;
}

export default function Attribution({ setUserInfo }: AttributionProps) {
  const [buttonSelected, setButtonSelected] = useState<string>('');

  const handleClick = (option: string) => {
    setButtonSelected(option);
    setUserInfo((prev: any) => ({
      ...prev,
      attribution: option,
    }));
  };

  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 text-center font-rosario'>
        How did you discover iWannaLearn?
      </p>
      <div className='lg:w-[480px] w-full flex flex-col gap-2'>
        {attributionOptions?.map((option) => (
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
