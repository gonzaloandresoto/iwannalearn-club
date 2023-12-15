'use client';

import React from 'react';

import CourseCard from '@/components/CourseComponents/CourseCard';
import { unitContent } from '@/constants';

export default function CourseContent() {
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
