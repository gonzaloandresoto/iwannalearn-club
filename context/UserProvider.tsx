'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  use,
} from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  onboarding: boolean;
}

interface IUserContext {
  clerkId: string;
  setClerkId: Dispatch<SetStateAction<string>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<any>>;
}

const UserContext = createContext<IUserContext>(null!);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [clerkId, setClerkId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
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

    fetch('/api/user-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: clerkId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'OK') {
          setUser(data.data);
        } else if (data.message === 'User not found') {
          setTimeout(() => {
            setRetryCount((prevCount) => prevCount + 1);
          }, retryInterval);
        }
      });
  }, [clerkId, retryCount]);

  if (user && user.onboarding === false) router.push('/onboarding');

  const value = {
    clerkId,
    setClerkId,
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
