'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserContext from '@/hooks/useUserContext';

import Attribution from '@/components/Onboarding/Attribution';
import Benefits from '@/components/Onboarding/Benefits';
import UserPending from '@/components/Onboarding/UserPending';
import WhyLearn from '@/components/Onboarding/WhyLearn';
import AccountDetails from '@/components/Onboarding/AccountDetails';
import { updateUserDetails } from '@/lib/actions/user.actions';
import { useLogSnag } from '@logsnag/next';

export default function Page() {
  const router = useRouter();
  const [activePage, setActivePage] = useState(0);
  const { track, setUserId, setDebug } = useLogSnag();

  const { user } = useUserContext();

  setUserId(user?._id || '');

  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    attribution: '',
    whyLearn: '',
  });

  useEffect(() => {
    if (!user) return;
    else if (user.onboarding) {
      router.push('/');
    }
  }, [user]);

  const nextPage = async () => {
    if (activePage === 3) {
      await updateUserDetails(user?._id || '', userInfo, true);
      track({
        channel: 'user',
        event: 'Profile Completed',
        icon: '👋',
        notify: true,
        tags: {
          atrribution: userInfo.attribution,
        },
      });
      router.push('/');
    } else {
      setActivePage(activePage + 1);
    }
  };

  return user ? (
    <div className='main-page'>
      {activePage === 0 && <AccountDetails setUserInfo={setUserInfo} />}
      {activePage === 1 && <Attribution setUserInfo={setUserInfo} />}
      {activePage === 2 && <WhyLearn setUserInfo={setUserInfo} />}
      {activePage === 3 && <Benefits />}
      <div className='w-full min-h-[88px] flex gap-2 justify-center pt-[16px] border-t-2 border-primary-tan'>
        <button
          disabled={activePage === 3 && !user}
          onClick={nextPage}
          className='main-button'
        >
          {activePage === 3 ? 'Get started' : 'Continue'}
        </button>
      </div>
    </div>
  ) : (
    <UserPending />
  );
}
