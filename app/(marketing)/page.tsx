import Letter from '@/components/Marketing/Letter';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='relative grow flex flex-col gap-12 bg-secondary-tan lg:px-16 xl:px-24 px-4 lg:pb-0 pb-8 sm:text-left text-center lg:overflow-y-hidden'>
      <div className='z-20 flex-none h-[88px] sm:h-[104px] flex items-center justify-between'>
        <Image
          src='/assets/logo-circle.png'
          alt='iWannaLearn Logo'
          width={56}
          height={56}
        />

        <div className='flex flex-row gap-4 items-center'>
          <Link
            href='mailto:gonzalo@visioneleven.world'
            className='nav-text'
          >
            Contact
          </Link>
          <SignedIn>
            <Link href='/generate'>
              <button className='w-max px-6 py-4 nav-text'>Home</button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href='/signup'>
              <button className='w-max px-6 py-4 nav-text'>Sign up</button>
            </Link>
          </SignedOut>
        </div>
      </div>

      <div className='z-20 grow flex lg:flex-row flex-col lg:items-start items-center gap-16 justify-between px-4'>
        <div className='flex flex-col lg:items-start items-center gap-8 font-sourceSerif lg:text-left text-center text-secondary-black'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 text-base md:text-xl font-medium'>
              <p>iwannalearn.mindfulness</p>
              <p>iwannalearn.guitar</p>
              <p>iwannalearn.history</p>
            </div>

            <p className='text-4xl md:text-5xl xl:text-6xl font-bold font-sourceSerif'>
              iWannaLearn
            </p>
          </div>
          <SignedIn>
            <Link
              href='/generate'
              className='w-max bg-secondary-black px-6 py-4 md:px-12 md:py-6 lg:text-2xl text-lg font-rosario text-tertiary-tan'
            >
              Home
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href='/signup'
              className='w-max bg-secondary-black px-6 py-4 md:px-12 md:py-6 lg:text-2xl text-lg font-rosario text-tertiary-tan'
            >
              Signup
            </Link>
          </SignedOut>
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

      <div className='lg:hidden w-full flex flex-col gap-4 text-center text-secondary-black font-rosario bg-white px-4 py-6 rounded-sm shadow-md'>
        <p>{`hey stranger!`}</p>
        <p>{`ever think about how little incentive most "education" companies have to actually teach you stuff?`}</p>
        <p>{`to most, you're an engagement metric at risk of losing interest at anytime. why? the faster you pick up a skill, the less time you'll spend on their platform.`}</p>
        <p>{`the internet birthed a generation of self-taught thinkers.`}</p>
        <p>{`free from institutional constraints.`}</p>
        <p>{`who crave knowledge to understand the world.`}</p>
        <p>{`iWannaLearn is not just another educational company. We're a much-needed revolution in learning.`}</p>
        <p>{`We're tearing down the walls of conventional education and building a community where knowledge is limitless and accessible to everyone.`}</p>
        <p>{`we're doing this for you ❤️`}</p>
      </div>

      <div className='flex flex-col gap-2 lg:hidden h-[40px] bg-secondary-tan pb-8 items-center'>
        <p>{`Made w/ ❤️ in toronto`}</p>
        <Link
          href='mailto:gonzalo@visioneleven.world'
          className='underline'
        >
          Contact us
        </Link>
      </div>

      <Letter />

      <div className='hidden xl:block absolute top-24 -right-8 w-[560px] h-[560px] rounded-[64px] border-2 border-primary-tan'></div>
      <div className='hidden xl:block absolute -top-32 left-32 w-[720px] h-[720px] rounded-full border-2 border-primary-tan'></div>
      <div className='hidden xl:block absolute -bottom-24 -left-8 w-[1080px] h-[480px] rounded-r-[240px] border-2 border-primary-tan'></div>
    </div>
  );
}
