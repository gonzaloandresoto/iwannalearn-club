'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/Course/CourseComponents/CourseCard';
import { useParams, useSearchParams } from 'next/navigation';
import { getUnitElementsById } from '@/lib/actions/unit.actions';
import EmptyState from '@/components/Course/EmptyState';

interface UnitContent {
  _id: string;
  content?: string;
  createdAt: any;
  order: number;
  title?: string;
  type: string;
  updatedAt: any;
  answer?: string;
  choices?: any;
  unitId: string;
}

export default function UnitContent() {
  const { id, unit } = useParams<{ id: string; unit: string }>();
  const activePage = useSearchParams()?.get('activePage');
  const [unitContent, setUnitContent] = useState<UnitContent[]>([]);
  const [generatedNewContent, setGeneratedNewContent] = useState(false);

  useEffect(() => {
    const getUnitContent = async () => {
      const content = await getUnitElementsById(unit);
      if (content) {
        setUnitContent(content);
      }
    };
    getUnitContent();
  }, [unit, generatedNewContent]);

  return (
    <div className='course-page'>
      {unitContent.length > 0 ? (
        <CourseCard
          unitId={unit}
          courseId={id}
          unitContent={unitContent}
          activePage={activePage ? parseInt(activePage) : 0}
          generatedNewContent={generatedNewContent}
          setGeneratedNewContent={setGeneratedNewContent}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
