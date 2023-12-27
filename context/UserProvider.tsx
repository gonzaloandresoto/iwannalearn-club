'use client';

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

interface IUserContext {
  clerkId: string;
  setClerkId: Dispatch<SetStateAction<string>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<any>>;
}

const UserContext = createContext<IUserContext>(null!);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [clerkId, setClerkId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 10;
  const retryInterval = 1000;

  useEffect(() => {
    fetch('/api/clerk-id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClerkId(data);
      });
  }, []);

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

  const value = {
    clerkId,
    setClerkId,
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
