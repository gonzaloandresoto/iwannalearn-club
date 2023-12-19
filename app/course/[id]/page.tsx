'use client';

import React from 'react';

import CourseCard from '@/components/CourseComponents/CourseCard';
import { unitContent } from '@/constants';

interface SearchParamProps {
  searchParams: {
    id: string;
  };
}

export default function CourseContent({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const [activePage, setActivePage] = React.useState(0);
  return (
    <div className='flex flex-col items-center'>
      <CourseCard
        unitContent={unitContent}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  );
}
