'use client';

import { useEffect, useRef } from 'react';

const useScrollToBottom = (dependencies: any) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      ref.current?.scrollIntoView({ behavior: 'instant' });
    };

    scrollToBottom();
  }, [dependencies]);

  return ref;
};

export default useScrollToBottom;
