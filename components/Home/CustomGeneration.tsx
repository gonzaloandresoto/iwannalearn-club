'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ----- Custom Hooks ----- //
import useOutsideClick from '@/hooks/useOutsideClick';

// ----- Custom Generation Components ----- //
import GenerationType from './CustomGeneration/GenerationType';
import CoreConcepts from './CustomGeneration/CoreConcepts';
import ProposeTOC from './CustomGeneration/ProposeTOC';

// ----- Custom Generation Types ----- //
interface CustomGenerationProps {
  setCustomizeDrawer: (value: boolean) => void;
  topic: string;
}

interface CustomAttributes {
  topic: string;
  concepts: string[];
  tableOfContents: string[];
  experienceLevel: string;
}

export default function CustomGeneration({
  setCustomizeDrawer,
  topic,
}: CustomGenerationProps) {
  const customGenerationRef = useOutsideClick(() => setCustomizeDrawer(false));
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [customAttributes, setCustomAttributes] = useState<CustomAttributes>({
    topic: topic,
    concepts: [],
    tableOfContents: [],
    experienceLevel: '',
  });

  return (
    <motion.div
      ref={customGenerationRef}
      initial={{ y: '100%' }}
      animate={{
        y: 0,
        transition: { duration: 0.16, ease: 'easeInOut' },
      }}
      layout
      exit={{
        y: '100%',
        transition: { duration: 0.12, ease: 'easeInOut' },
      }}
      style={{ transform: 'translateX(-50%)' }}
      className='fixed z-50  bottom-0  max-w-[560px] min-h-[240px] w-full bg-white border-t-2 border-x-2 border-primary-tan px-6 pt-8 pb-16 rounded-t-xl'
    >
      {generationStep === 0 && (
        <GenerationType
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
          setGenerationStep={setGenerationStep}
        />
      )}
      {generationStep === 1 && (
        <CoreConcepts
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
          setGenerationStep={setGenerationStep}
        />
      )}
      {generationStep === 2 && (
        <ProposeTOC
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
        />
      )}
    </motion.div>
  );
}
