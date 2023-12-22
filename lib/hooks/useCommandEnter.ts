'use client';

import { useEffect } from 'react';

const useCommandEnter = (handleSubmit: (item: any) => void, item: any) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        ((e.metaKey || e.ctrlKey) && e.key === 'Enter') ||
        e.key === 'Enter'
      ) {
        handleSubmit(item);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmit, item]);
};

export default useCommandEnter;
