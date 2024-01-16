'use client';

import { useEffect, useState } from 'react';
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

export default function CourseCover({
  courseId,
  title,
  summary,
  tableOfContents,
}: CourseCoverProps) {
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
    <div className='course-card'>
      <div className='course-card-inner h-full items-center gap-6'>
        <div className='w-full flex flex-col items-center gap-4'>
          <p className='lg:text-4xl text-2xl text-center font-bold font-sourceSerif text-secondary-black'>
            {title}
          </p>
          <p className='md:text-lg text-base text-center text-tertiary-black font-medium font-rosario'>
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
    </div>
  );
}
