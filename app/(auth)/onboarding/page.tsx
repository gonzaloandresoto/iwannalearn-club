'use client';

import useUserContext from '@/hooks/useUserContext';
import Link from 'next/link';

export default function Page() {
  const { user } = useUserContext();
  return (
    <div>
      <p>Welcome to iWannaLearn</p>
      <p>Press the button once it's available to continue to the app</p>
      <Link href='/'>
        <button disabled={user === null}>Continue</button>
      </Link>
    </div>
  );
}
