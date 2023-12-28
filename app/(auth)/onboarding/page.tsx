'use client';

import { FallingLines } from 'react-loader-spinner';

import useUserContext from '@/hooks/useUserContext';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { user } = useUserContext();
  const router = useRouter();

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-4 items-center'>
        <FallingLines
          color='#0C54A8'
          width='100'
          visible={true}
        />
        <p className='text-2xl font-semibold'>Welcome to iWannaLearn</p>
        <p>
          We're just setting your account up, once it's finished loading, you'll
          be able to advance.
        </p>
        <button
          disabled={user === null}
          onClick={() => {
            router.push('/create');
          }}
          className='main-button disabled:opacity-50'
        >
          Continue
        </button>
      </div>
    </div>
  );
}
