'use client';

import useUserContext from '@/hooks/useUserContext';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';

export default function ProfileCard() {
  const { user } = useUserContext();
  if (!user) return null;
  return (
    <div className='w-full flex flex-row gap-8'>
      <Image
        src={user.photo}
        alt={`${user?.firstName} + ' profile photo'`}
        width={104}
        height={104}
        className='rounded-full'
      />
      <div className='flex flex-col gap-4'>
        <p className='text-2xl font-semibold'>
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
