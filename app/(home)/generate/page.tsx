'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserContext from '@/hooks/useUserContext';

import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import { getMostRecentCourse } from '@/lib/actions/generate.actions';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedTopics from '@/components/Home/RecommendedTopics';
import SearchBar from '@/components/Home/SearchBar';
import CustomGeneration from '@/components/Home/CustomGeneration';

export default function Generate() {
  const router = useRouter();
  const { user } = useUserContext();

  const [topic, setTopic] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customizeDrawer, setCustomizeDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (!isGenerating) return;

    const timer = setTimeout(async () => {
      const data = await getMostRecentCourse(user?._id || '');
      if (data?.courseId) {
        router.push(`/course/${data.courseId}`);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isGenerating]);

  return (
    <div className='main-page justify-center'>
      {isGenerating ? (
        <GeneratingCourse />
      ) : (
        <div className='flex flex-col gap-4 items-center justify-center'>
          <p className='md:text-5xl text-3xl text-secondary-black font-bold font-sourceSerif'>
            iWannaLearn
          </p>
          {/* <SearchBar setIsGenerating={setIsGenerating} /> */}
          <SearchBar
            topic={topic}
            setTopic={setTopic}
            setCustomizeDrawer={setCustomizeDrawer}
          />
          <RecommendedTopics setIsGenerating={setIsGenerating} />
          <>
            <AnimatePresence>
              {customizeDrawer && (
                <motion.div
                  key='backdrop'
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 0.48,
                    transition: { duration: 0.24, ease: 'easeOut' },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.24, ease: 'easeIn' },
                  }}
                  className='fixed top-0 w-screen h-screen bg-secondary-black'
                ></motion.div>
              )}
              {customizeDrawer && (
                <CustomGeneration
                  topic={topic}
                  setCustomizeDrawer={setCustomizeDrawer}
                />
              )}
            </AnimatePresence>
          </>
        </div>
      )}
    </div>
  );
}
