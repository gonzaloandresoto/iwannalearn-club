'use client';

import { set } from 'mongoose';
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  use,
} from 'react';

interface IUserContext {
  clerkId: string;
  setClerkId: Dispatch<SetStateAction<string>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

const UserContext = createContext<IUserContext>(null!);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [clerkId, setClerkId] = useState<string>('');
  const [user, setUser] = useState<any>(null);

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
    if (!clerkId) return;
    fetch('/api/user-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: clerkId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
  }, [clerkId]);

  const value = {
    clerkId,
    setClerkId,
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
