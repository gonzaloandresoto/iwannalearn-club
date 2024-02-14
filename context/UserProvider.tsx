'use client';

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { getUserById } from '@/lib/actions/user.actions';

import { User } from '@/types';

interface IUserContext {
  clerkId: string;
  setClerkId: Dispatch<SetStateAction<string>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<IUserContext>(null!);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [clerkId, setClerkId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { userId } = useAuth();

  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 15;
  const retryInterval = 2400;

  useEffect(() => {
    if (userId) {
      setClerkId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!clerkId || retryCount > maxRetries) return;

    const getUserDetails = async () => {
      const response = await getUserById(clerkId);

      if (!response) {
        setTimeout(
          () => setRetryCount((prevCount) => prevCount + 1),
          retryInterval
        );
      } else {
        setUser(response);
      }
    };

    getUserDetails();
  }, [clerkId, retryCount]);

  if (user && !user.onboarding) router.push('/onboarding');

  const value = {
    clerkId,
    setClerkId,
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
