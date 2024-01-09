'use client';

import React, { useEffect, useState } from 'react';
import TableOfContents from './Other/TableOfContents';
import {
  getNextUncompletedUnit,
  getUnitCompletions,
} from '@/lib/actions/unit.actions';

interface CourseCoverProps {
  courseId: string;
  title: string;
  summary: string;
  tableOfContents: string;
}

interface UnitCompletionsItem {
  [key: string]: {
    status: string;
    order: string;
  };
}

const CourseCover: React.FC<CourseCoverProps> = ({
  courseId,
  title,
  summary,
  tableOfContents,
}) => {
  const [nextUnit, setNextUnit] = useState<string>('');
  const [unitCompletions, setUnitCompletions] = useState<UnitCompletionsItem>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      const next = await getNextUncompletedUnit(courseId);
      const completions = await getUnitCompletions(courseId);
      setNextUnit(next?.toString() || '');
      setUnitCompletions(completions);
    };

    fetchData();
  }, [courseId]);

  return (
    <div className='lg:w-[800px] w-full lg:h-5/6 h-full flex flex-col gap-6 items-center lg:px-12 px-4 lg:pt-16 pt-12 bg-white lg:border-2 border-t-2 border-primary-tan lg:rounded-t-2xl overflow-y-auto'>
      <div className='w-full flex flex-col gap-4'>
        <p className='lg:text-4xl text-2xl text-center font-bold font-sourceSerif text-secondary-black'>
          {title}
        </p>
        <p className='md:text-lg text-base text-tertiary-black font-medium font-rosario'>
          {summary}
        </p>
      </div>
      <div className='h-[2px] bg-primary-tan w-1/3'></div>
      <TableOfContents
        tableOfContents={tableOfContents}
        courseId={courseId}
        nextUnit={nextUnit}
        unitCompletions={unitCompletions}
      />
    </div>
  );
};

export default CourseCover;
