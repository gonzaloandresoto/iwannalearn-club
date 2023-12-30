'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseComponents/CourseCard';
import { useParams } from 'next/navigation';

export default function UnitContent() {
  const { id, unit } = useParams<{ id: string; unit: string }>();

  const [unitContent, setUnitContent] = useState([]);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    fetch('/api/unit-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unit: unit }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUnitContent(data);
      });
  }, []);

  return (
    <div className='flex grow justify-center'>
      <CourseCard
        unitId={unit}
        courseId={id}
        unitContent={unitContent}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  );
}
