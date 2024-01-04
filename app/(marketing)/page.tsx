import Letter from '@/components/Marketing/Letter';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='relative grow flex flex-col gap-12 bg-secondary-tan lg:px-16 xl:px-24 sm:text-left text-center lg:overflow-y-hidden'>
      <div className='z-20 flex-none h-[88px] sm:h-[104px] flex items-center justify-between px-4'>
        <Image
          src='/assets/logo-circle.png'
          alt='iWannaLearn Logo'
          width={56}
          height={56}
        />
        <SignedIn>
          <Link href='/generate'>
            <button className='w-max px-6 py-4 text-xl font-rosario text-secondary-black underline'>
              Home
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <Link href='/generate'>
            <button className='w-max px-6 py-4 text-xl font-rosario text-secondary-black underline'>
              Sign in
            </button>
          </Link>
        </SignedOut>
      </div>

      <div className='z-20 grow flex lg:flex-row flex-col lg:items-start items-center gap-16 justify-between px-4'>
        <div className='flex flex-col lg:items-start items-center gap-8 font-sourceSerif lg:text-left text-center text-secondary-black'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 text-base md:text-xl font-medium'>
              <p>iwannalearn.mindfulness</p>
              <p>iwannalearn.guitar</p>
              <p>iwannalearn.history</p>
            </div>

            <p className='text-4xl md:text-5xl xl:text-6xl font-semibold'>
              iwannalearn
            </p>
          </div>

          <button className='w-max bg-secondary-black px-6 py-4 md:px-12 md:py-6 lg:text-2xl text-lg font-rosario text-tertiary-tan'>
            Join waitlist
          </button>
        </div>

        <div className='max-w-[560px] md:max-w-full z-20'>
          <Image
            src='/assets/hero-examples.png'
            alt='iWannaLearn Hero Image'
            width={800}
            height={760}
          />
        </div>
      </div>

      <div className='sm:hidden h-[40px]'>
        <p>{`Made w/ ❤️ in toronto`}</p>
      </div>
      <Letter />

      <div className='hidden xl:block absolute top-24 -right-8 w-[560px] h-[560px] rounded-[64px] border-2 border-primary-tan'></div>
      <div className='hidden xl:block absolute -top-32 left-32 w-[720px] h-[720px] rounded-full border-2 border-primary-tan'></div>
      <div className='hidden xl:block absolute -bottom-24 -left-8 w-[1080px] h-[480px] rounded-r-[240px] border-2 border-primary-tan'></div>
    </div>
  );
}
