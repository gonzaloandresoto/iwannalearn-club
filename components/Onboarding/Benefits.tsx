import Image from 'next/image';

import { iwlBenefits } from '@/constants';

export default function Benefits() {
  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 font-rosario text-center'>
        {`Here's why you'll love iWannaLearn`}
      </p>
      <div className='lg:w-[720px] w-full flex flex-col gap-4'>
        {iwlBenefits?.map((option, index) => (
          <div
            key={index}
            className='w-full flex items-center gap-8 px-4 py-6 border-2 border-primary-tan rounded-lg'
          >
            {option?.icon && (
              <Image
                src={option?.icon}
                alt={option?.title + ' icon'}
                width={48}
                height={48}
              />
            )}
            <div className='flex flex-col gap-2'>
              <p className='h2 font-sourceSerif'>{option?.title}</p>
              <p className='lg:text-lg text-base text-tertiary-black font-rosario'>
                {option?.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
