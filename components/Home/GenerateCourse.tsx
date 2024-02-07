'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

import RecommendedTopics from '@/components/Home/RecommendedTopics';
import InputBar from '@/components/Home/InputBar';
import CustomGenerationModal from '@/components/Home/CustomGeneration/CustomGenerationModal';

const GenerateCourse = () => {
  const [topic, setTopic] = useState<string>('');
  const [customizeDrawer, setCustomizeDrawer] = useState<boolean>(false);
  return (
    <div className='flex flex-col gap-4 items-center w-full py-24'>
      <p className='md:text-5xl text-3xl text-secondary-black font-bold font-sourceSerif'>
        iWannaLearn
      </p>
      <InputBar
        topic={topic}
        setTopic={setTopic}
        setCustomizeDrawer={setCustomizeDrawer}
      />
      <RecommendedTopics
        setTopic={setTopic}
        setCustomizeDrawer={setCustomizeDrawer}
      />
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
  );
};

export default GenerateCourse;
