'use client';

import useUserContext from '@/hooks/useUserContext';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';

export default function ProfileCard() {
  const { user } = useUserContext();

  return (
    <div className='max-w-[720px] w-full flex flex-row items-center gap-4'>
      {user?.photo ? (
        <Image
          src={user.photo}
          alt={`${user?.firstName}` + ' profile photo'}
          width={88}
          height={88}
          className='rounded-full'
        />
      ) : (
        <p className='text-white'>{user?.firstName?.charAt(0)}</p>
      )}

      <div className='flex flex-col gap-4'>
        <p className='text-xl text-secondary-black font-rosario font-semibold'>
          {user?.firstName} {user?.lastName}
        </p>
        <div className='flex flex-row gap-4'>
          <button className='secondary-button'>Edit profile</button>
          <SignOutButton>
            <button className='secondary-button'>Sign out</button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
