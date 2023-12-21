'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

interface ITOCContext {
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  tableOfContents: ITableOfContents[];
  setTableOfContents: Dispatch<SetStateAction<ITableOfContents[]>>;
  courseProgress: number;
  setCourseProgress: Dispatch<SetStateAction<number>>;
  updatedQuizId: boolean;
  setUpdatedQuizId: Dispatch<SetStateAction<boolean>>;
}

export interface ITableOfContents {
  unitName: string;
  courseId: string;
  content: {
    title: string;
    type: string;
    unitId: string;
    status: boolean;
  }[];
}
[];

const TOCContext = createContext<ITOCContext>(null!);

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string>('');
  const [tableOfContents, setTableOfContents] = useState<ITableOfContents[]>(
    []
  );
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [updatedQuizId, setUpdatedQuizId] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetch('/api/course-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCourseProgress(data.progress);
      });
  }, [id, updatedQuizId]);

  useEffect(() => {
    if (!id) return;
    fetch('/api/course-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTableOfContents(data);
      });
  }, [id, updatedQuizId]);

  const value = {
    id,
    setId,
    tableOfContents,
    setTableOfContents,
    courseProgress,
    setCourseProgress,
    updatedQuizId,
    setUpdatedQuizId,
  };

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
}

export default TOCContext;
