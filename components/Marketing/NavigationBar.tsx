import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationBar() {
  return (
    <nav className='sticky top-0 z-20 flex-none h-[64px] md:h-[80px] flex justify-center bg-tertiary-tan'>
      <div className='max-w-[1024px] w-full h-full flex items-center justify-between px-4'>
        <div className='relative md:w-[56px] md:h-[56px] w-[40px] h-[40px]'>
          <Image
            src='/assets/logo-circle.png'
            alt='iWannaLearn Logo'
            fill
          />
        </div>
        <div className='flex flex-row gap-8 items-center '>
          <Link
            href='mailto:gonzalo@visioneleven.world'
            className='nav-text hover:underline'
          >
            Contact
          </Link>
          <SignedIn>
            <Link href='/'>
              <button className='nav-text hover:underline'>Home</button>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href='/signup'>
              <button className='nav-text hover:underline'>Sign up</button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
