import Image from 'next/image';
import NavItems from './NavItems';
import ProfileComponent from './ProfileComponent';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

const NavigationBar = () => {
  return (
    <div className='w-full h-[72px] flex flex-row items-center justify-between px-4 md:px-32'>
      <Image
        src=''
        alt='iwannalearn logo'
        width={40}
        height={40}
      />
      <div className='flex flex-row gap-8 items-center'>
        <SignedIn>
          <NavItems />
          <ProfileComponent />
        </SignedIn>

        <SignedOut>
          <Link
            href='/signup'
            className='w-full h-full'
          >
            <button className='main-button'>Sign up</button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default NavigationBar;
