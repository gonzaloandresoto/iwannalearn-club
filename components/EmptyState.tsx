import Image from 'next/image';
import React from 'react';

interface EmptyStateProps {
  text: string;
  image: string;
}

function EmptyState({ text, image }: EmptyStateProps) {
  return (
    <div className='flex grow flex-col gap-4  items-center justify-center bg-tertiary-tan px-4'>
      {image && (
        <Image
          src={image}
          alt='Empty state icon'
          width={88}
          height={72}
        />
      )}
      <p className='text-lg text-tertiary-black font-rosario font-semibold'>
        {text}
      </p>
    </div>
  );
}

export default EmptyState;
