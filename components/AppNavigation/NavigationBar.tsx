import Image from 'next/image';
import NavItems from './NavItems';
import ProfileComponent from './ProfileComponent';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

const NavigationBar = () => {
  return (
    <div className='sticky top-0 z-30 min-h-[72px] w-full flex flex-row items-center justify-between px-4 lg:px-32 bg-tertiary-tan'>
      <Link href='/'>
        <Image
          src='/assets/logo-circle.png'
          alt='iwannalearn logo'
          width={48}
          height={48}
        />
      </Link>

      <div className='flex flex-row gap-8 items-center'>
        <SignedIn>
          <NavItems />
          <ProfileComponent />
        </SignedIn>

        <SignedOut>
          <Link href='/signup'>
            <button className='primary-button hover:bg-tertiary-black rounded-md text-base text-white font-rosario font-semibold px-4 py-3'>
              Sign up
            </button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default NavigationBar;
