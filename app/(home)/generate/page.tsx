'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import GeneratingCourse from '@/components/Home/GeneratingCourse';
import RecommendedTopics from '@/components/Home/RecommendedTopics';
import SearchBar from '@/components/Home/SearchBar';
import CustomGenerationModal from '@/components/Home/CustomGeneration/CustomGenerationModal';

export default function Generate() {
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customizeDrawer, setCustomizeDrawer] = useState<boolean>(false);

  return (
    <div className='main-page justify-center'>
      {isGenerating ? (
        <GeneratingCourse />
      ) : (
        <div className='flex flex-col gap-4 items-center justify-center'>
          <p className='md:text-5xl text-3xl text-secondary-black font-bold font-sourceSerif'>
            iWannaLearn
          </p>
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
                  className='fixed z-40 top-0 w-screen h-screen bg-secondary-black'
                ></motion.div>
              )}
              {customizeDrawer && (
                <CustomGenerationModal
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
