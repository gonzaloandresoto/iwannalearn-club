'use client';
import { useState } from 'react';
import LessonActionsDesktop from './LessonActionsDesktop';
import EmptyState from '@/components/Home/CustomGeneration/EmptyState';

interface Content {
  title?: string;
  content?: string;
  _id: string;
}

interface LessonContentProps {
  item: Content;
  unitId: string;
}

export default function LessonContent({ item, unitId }: LessonContentProps) {
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) return <EmptyState />;

  return (
    <div className='lesson-quiz-content'>
      <div className='w-full flex flex-col gap-6'>
        <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
          {item?.title}
        </p>
        <p className='md:text-xl text-lg text-tertiary-black font-medium font-rosario'>
          {item?.content}
        </p>
      </div>

      <LessonActionsDesktop
        lesson={item}
        unitId={unitId}
        setLoading={setLoading}
      />
    </div>
  );
}
