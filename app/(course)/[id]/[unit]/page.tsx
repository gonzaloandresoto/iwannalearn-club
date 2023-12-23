'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseComponents/CourseCard';
import { useParams } from 'next/navigation';

export default function UnitContent() {
  const params = useParams<{ id: string; unit: string }>();

  const [unitContent, setUnitContent] = useState([]);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    fetch('/api/unit-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unit: params.unit }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUnitContent(data);
      });
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <CourseCard
        unitId={params.unit}
        courseId={params.id}
        unitContent={unitContent}
        activePage={activePage}
        setActivePage={setActivePage}
      />
    </div>
  );
}
