'use client';

import { useRef, useState, useEffect } from 'react';

interface CourseCardProgressProps {
  progress: number;
}

export default function CourseCardProgress({
  progress,
}: CourseCardProgressProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progressBarWidth, setProgressBarWidth] = useState<number>(0);

  useEffect(() => {
    if (progressBarRef.current) {
      const width = progressBarRef.current.clientWidth * (progress / 100);
      setProgressBarWidth(width);
    }
  }, [progress]);

  return (
    <div className='w-full flex flex-col gap-2'>
      <p className='text-xl font-semibold font-rosario'>{`Progress: ${progress}%`}</p>
      <div
        ref={progressBarRef}
        className='w-full h-[20px] bg-primary-tan'
      >
        <div
          className='h-full bg-secondary-black'
          style={{ width: `${progressBarWidth}px` }}
        ></div>
      </div>
    </div>
  );
}
