'use client';

import { easeInOut, motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: easeInOut, duration: 0.25 }}
      className='flex grow flex-col'
    >
      {children}
    </motion.div>
  );
}
