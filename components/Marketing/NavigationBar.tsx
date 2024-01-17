import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationBar() {
  return (
    <nav className='sticky top-0 z-20 flex-none max-h-[88px] sm:max-h-[80px] h-full flex justify-center bg-tertiary-tan'>
      <div className='max-w-[1024px] w-full h-full flex items-center justify-between px-4'>
        <Image
          src='/assets/logo-circle.png'
          alt='iWannaLearn Logo'
          width={56}
          height={56}
        />

        <div className='flex flex-row gap-8 items-center '>
          <Link
            href='mailto:gonzalo@visioneleven.world'
            className='nav-text hover:underline'
          >
            Contact
          </Link>
          <SignedIn>
            <Link href='/generate'>
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
