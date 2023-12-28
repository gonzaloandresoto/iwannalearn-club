import Letter from '@/components/Marketing/Letter';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='relative grow flex flex-col gap-12 bg-secondary-tan lg:px-24 sm:text-left text-center lg:overflow-y-hidden'>
      <div className='flex-none h-[88px] sm:h-[104px] flex items-center justify-between px-4'>
        <Image
          src='/assets/logo-circle.png'
          alt='iWannaLearn Logo'
          width={56}
          height={56}
        />
        <Link href='/signin'>
          <button className='w-max px-6 py-4 text-xl font-rosario text-secondary-black underline'>
            Sign in
          </button>
        </Link>
      </div>

      <div className='grow flex sm:flex-row flex-col gap-16 justify-between px-4'>
        <div className='flex flex-col sm:items-start items-center gap-8 font-sourceSerif text-secondary-black'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 text-base sm:text-xl font-medium'>
              <p>iwannalearn.mindfulness</p>
              <p>iwannalearn.guitar</p>
              <p>iwannalearn.history</p>
            </div>
            <p className='text-4xl sm:text-6xl font-semibold'>iwannalearn</p>
          </div>
          <button className='w-max bg-secondary-black px-6 py-4 sm:px-12 sm:py-6 text-2xl font-rosario text-tertiary-tan'>
            Join waitlist
          </button>
        </div>
        <div className=''>
          <Image
            src='/assets/hero-examples.png'
            alt='iWannaLearn Logo'
            width={800}
            height={760}
          />
        </div>
      </div>

      <div className='sm:hidden h-[40px]'>
        <p>{`Made w/ ❤️ in toronto`}</p>
      </div>
      <Letter />
    </div>
  );
}
