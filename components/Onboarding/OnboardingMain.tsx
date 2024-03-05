'use client';

import { useEffect, useState } from 'react';
import useUserContext from '@/lib/hooks/useUserContext';
import { useRouter } from 'next/navigation';
import { useLogSnag } from '@logsnag/next';

import UserPending from '@/components/Onboarding/UserPending';
import AccountDetails from '@/components/Onboarding/AccountDetails';
import Attribution from '@/components/Onboarding/Attribution';
import WhyLearn from '@/components/Onboarding/WhyLearn';
import Benefits from '@/components/Onboarding/Benefits';

import { updateUserDetails } from '@/lib/actions/user.actions';

function OnboardingMain() {
  const { user } = useUserContext();
  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    attribution: '',
    whyLearn: '',
  });
  const [activePage, setActivePage] = useState<number>(0);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const { track, setUserId } = useLogSnag();
  const router = useRouter();

  // REDIRECT USER IF ONBOARDING IS ALREADY COMPLETED

  useEffect(() => {
    if (user && user.onboarding) {
      router.push('/');
    }
  }, [user]);

  // PREVENT SUBMIT IF USER INFO IS NOT COMPLETE

  const isUserInfoComplete = () => {
    return (
      userInfo.firstName.trim() !== '' &&
      userInfo.attribution.trim() !== '' &&
      userInfo.whyLearn.trim() !== ''
    );
  };

  useEffect(() => {
    setCanSubmit(!isUserInfoComplete());
  }, [activePage]);

  if (!user) return <UserPending />;

  // LOGIC TO NAVIGATE TO NEXT PAGE & SUBMIT

  const completeOnboarding = async (
    userId: string,
    userInfo: any,
    completed: boolean
  ) => {
    await updateUserDetails(userId, userInfo, completed);
    setUserId(userId);
    track({
      channel: 'user',
      event: 'Profile Completed',
      icon: '👋',
      notify: true,
      tags: {
        atrribution: userInfo.attribution,
        why: userInfo.whyLearn,
        user: userInfo?.firstName + userInfo?.lastName || '',
        id: userId,
      },
    });
  };

  const nextPage = async () => {
    if (activePage === 3) {
      await completeOnboarding(user?._id || '', userInfo, true);
      router.push('/');
    } else {
      setActivePage(activePage + 1);
    }
  };

  return (
    <>
      {activePage === 0 && <AccountDetails setUserInfo={setUserInfo} />}
      {activePage === 1 && <Attribution setUserInfo={setUserInfo} />}
      {activePage === 2 && <WhyLearn setUserInfo={setUserInfo} />}
      {activePage === 3 && <Benefits />}
      <div className='w-full min-h-[88px] flex gap-2 justify-center pt-[16px] border-t-2 border-primary-tan'>
        <button
          disabled={activePage === 3 && canSubmit}
          onClick={nextPage}
          className='main-button disabled:opacity-50'
        >
          {activePage === 3 ? 'Get started' : 'Continue'}
        </button>
      </div>
    </>
  );
}

export default OnboardingMain;
