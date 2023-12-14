'use client';

import { useRouter } from 'next/navigation';
import CourseProgress from './CourseProgress';

export default function NavigationBar() {
  const router = useRouter();

  const returnHome = () => {
    router.push('/');
  };
  return (
    <div className='relative w-4/5 flex items-center justify-center h-[96px]'>
      <button
        onClick={returnHome}
        className='absolute left-0 w-[48px] h-[48px] flex-none bg-tertiary-grey rounded-md'
      >
        ←
      </button>

      <p className='text-xl text-primary-grey font-titan'>superMe</p>

      <div className='absolute right-0 flex gap-2 h-[48px]'>
        <button className=' w-[48px] h-[48px] flex-none bg-primary-blue rounded-md'>
          ⭐️
        </button>
        <CourseProgress />
      </div>
    </div>
  );
}
