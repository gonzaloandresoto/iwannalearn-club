'use client';

import {
  createContext,
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
  wasQuizUpdated: boolean;
  setWasQuizUpdated: Dispatch<SetStateAction<boolean>>;
}

interface ITableOfContents {
  unitName: string;
  courseId: string;
  content: {
    title: string;
    type: string;
    unitId: string;
    status: boolean;
    completed: boolean;
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
  const [wasQuizUpdated, setWasQuizUpdated] = useState<boolean>(false);

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
        setCourseProgress(data);
      });
  }, [id, wasQuizUpdated]);

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
        // if (Object.values(data).some((item) => item.content.length == 0)) {
        //   setTimeout(() => {
        //     setIsTOCLoaded((prev) => !prev), 3000;
        //   });
        // } else {
        setTableOfContents(data);
        // }
      });
  }, [id, wasQuizUpdated]);

  const value = {
    id,
    setId,
    tableOfContents,
    setTableOfContents,
    courseProgress,
    setCourseProgress,
    wasQuizUpdated,
    setWasQuizUpdated,
  };

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
}

export default TOCContext;
