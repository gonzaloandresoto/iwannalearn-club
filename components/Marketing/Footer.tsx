import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className='w-full flex justify-center md:py-12 py-8 bg-tertiary-tan'>
      <div className='max-w-[1024px] w-full h-full flex flex-col items-center justify-center'>
        <p>{`Made w/ ❤️ in toronto`}</p>
        <Link
          href='mailto:gonzalo@visioneleven.world'
          className='underline'
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
