'use client';

import { useState } from 'react';
import LessonContent from './LessonContent';
import LessonControls from './LessonControls';
import { Lesson, UnitLessons } from '@/types';

interface LessonCardProps {
  lesson: Lesson | undefined;
  unitLessons: UnitLessons[] | undefined;
  courseId: string;
  unitId: string;
}

export default function LessonCard({
  lesson,
  unitLessons,
  courseId,
  unitId,
}: LessonCardProps) {
  const [generating, setGenerating] = useState<boolean>(false);
  return (
    <div className='course-card'>
      <LessonContent
        lesson={lesson}
        lessonTitles={unitLessons}
        setGenerating={setGenerating}
      />
      <LessonControls
        lessonId={lesson?._id || ''}
        unitLessons={unitLessons}
        courseId={courseId}
        unitId={unitId}
        generating={generating}
      />
    </div>
  );
}
