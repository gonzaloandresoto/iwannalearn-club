import { auth } from '@clerk/nextjs';
import { Stars } from 'lucide-react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/Marketing/Footer';
import { courseGridData } from '@/constants';

export default function Page() {
  // --- REDIRECTION TO MAIN IF NO SESSION --- //
  const { userId } = auth();
  if (userId) {
    redirect('/generate');
  }

  return (
    <div className='grow bg-tertiary-tan'>
      <div className='w-full flex flex-col  items-center px-4  bg-tertiary-tan'>
        <div className='max-w-[1024px] w-full flex flex-col gap-8 items-center justify-center py-16'>
          <h1 className='md:text-6xl text-4xl text-secondary-black text-center font-bold font-serif'>
            Learn anything with AI
          </h1>
          <h3 className='max-w-[700px] md:text-lg text-center font-sourceSerif font-medium'>
            Unlimited, easy-to-learn AI generated courses on any subject,
            accompanied by an expert AI tutor.
          </h3>
          <Link href='/signup'>
            <button className='bg-secondary-black  text-tertiary-tan flex flex-row items-center gap-4 px-6 py-4 rounded-md hover:bg-tertiary-black md:text-2xl text-lg'>
              <Stars />
              <p className='font-rosario'>Get started</p>
            </button>
          </Link>
        </div>

        <div className='max-w-[1024px] w-full grid sm:grid-cols-2 grid-cols-1 SM:gap-12 gap-4'>
          {courseGridData?.map((course) => (
            <GridCard
              key={course.title}
              title={course.title}
              subtitle={course.subtitle}
              href={course.href}
            />
          ))}
        </div>

        <div className='max-w-[1024px] w-full flex flex-col items-center gap-4 p-6 bg-secondary-black mt-12 mb-2 text-lg text-tertiary-tan font-rosario font-medium rounded-sm'>
          <p>{`hey stranger,`}</p>
          <p>{`the internet birthed a generation of self-taught thinkers.`}</p>
          <p>{`who crave knowledge to understand the world.`}</p>
          <p>{`we're doing this for you `}</p>
          <p>{`iWannaLearn is not just another educational platform. We're a much-needed revolution in learning.`}</p>
          <p>{`We're tearing down the walls of conventional education to make knowledge limitless and accessible to everyone.`}</p>
        </div>

        <Footer />
      </div>
    </div>
  );
}

interface GridCardProps {
  title: string;
  subtitle: string;
  href: string;
}

function GridCard({ title, subtitle, href }: GridCardProps) {
  return (
    <div className='w-full h-max grid gap-4 border-2 border-primary-tan rounded-xl px-4 py-6'>
      <div className='relative w-full sm:h-[240px] h-[160px]'>
        <Image
          src={`/assets/${href}`}
          alt={title}
          objectFit='contain'
          fill
        />
      </div>
      <div className='grid gap-1'>
        <p className='md:text-2xl text-lg text-secondary-black font-bold font-rosario'>
          {title}
        </p>
        <p className='md:text-lg text-base text-tertiary-black font-medium font-rosario'>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
