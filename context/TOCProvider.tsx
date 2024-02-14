'use client';

import {
  getCourseById,
  getCourseContentById,
  getCourseProgressById,
} from '@/lib/actions/course.actions';
import { StructuredCourseContent } from '@/types';

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
  tableOfContents: StructuredCourseContent;
  setTableOfContents: Dispatch<SetStateAction<StructuredCourseContent>>;
  courseProgress: number;
  setCourseProgress: Dispatch<SetStateAction<number>>;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  courseDetails: any;
}

const TOCContext = createContext<ITOCContext>(null!);

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string>('');
  const [tableOfContents, setTableOfContents] =
    useState<StructuredCourseContent>({});
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [courseDetails, setCourseDetails] = useState<any>({});

  useEffect(() => {
    if (!id) return;
    const courseDetails = async () => {
      const courseDetailsData = await getCourseById(id);
      setCourseDetails(courseDetailsData);
    };
    courseDetails();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const courseProgress = async () => {
      const progress = await getCourseProgressById(id);
      setCourseProgress(progress);
    };
    courseProgress();
  }, [id, refresh]);

  useEffect(() => {
    if (!id) return;
    const getTableOfContents = async () => {
      const TOC = await getCourseContentById(id);
      if (TOC) {
        setTableOfContents(TOC);
      }
    };
    getTableOfContents();
  }, [id, refresh]);

  const value = {
    id,
    setId,
    courseDetails,
    tableOfContents,
    setTableOfContents,
    courseProgress,
    setCourseProgress,
    refresh,
    setRefresh,
  };

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
}

export default TOCContext;
