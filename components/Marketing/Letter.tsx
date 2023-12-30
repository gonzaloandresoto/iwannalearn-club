'use client';

import useOutsideClick from '@/lib/hooks/useOutsideClick';
import Image from 'next/image';
import { useState } from 'react';

export default function Letter() {
  const [unhide, setUnhide] = useState<boolean>(false);
  const ref = useOutsideClick(() => setUnhide(false));

  const positionClasses = unhide
    ? 'absolute left-1/2 -translate-x-1/2 bottom-0 rotate-0 cursor-default'
    : 'absolute xl:left-[30%]  xl:-bottom-[55%] left-[45%] -bottom-[35%] -translate-x-[50%] rotate-12 cursor-pointer';

  return (
    <div
      ref={ref}
      onClick={() => setUnhide(!unhide)}
      className={`${positionClasses} z-50 hidden lg:flex transition-all duration-700 w-[800px] h-[720px] xl:w-[960px] xl:h-[800px] flex-col gap-6 px-8 py-12 bg-white shadow-lg font-sourceSerif text-secondary-black text-lg xl:text-xl`}
    >
      <div>
        <Image
          src='/assets/letter-stickers.png'
          alt='iWannaLearn letter stickers'
          height={48}
          width={144}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <p>{`hey stranger!`}</p>
        <p>{`ever think about how little incentive most "education" companies have to actually teach you stuff?`}</p>
        <p>{`to most, you're an engagement metric at risk of losing interest at anytime. why? the faster you pick up a skill, the less time you'll spend on their platform.`}</p>
        <p>{`the internet birthed a generation of self-taught thinkers.`}</p>
        <p>{`free from institutional constraints.`}</p>
        <p>{`who crave knowledge to understand the world.`}</p>
        <p>{`we're doing this for you ❤️`}</p>
        <p>{`iWannaLearn is not just another educational company. We're a much-needed revolution in learning. We're tearing down the walls of conventional education and building a community where knowledge is limitless and accessible to everyone.`}</p>
      </div>
    </div>
  );
}
