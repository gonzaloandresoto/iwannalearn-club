'use client';

import { useState } from 'react';
import LessonContent from './CourseComponents/LessonContent';
import LessonControls from './LessonControls';

export default function LessonCard({
  lesson,
  unitLessons,
  courseId,
  unitId,
}: any) {
  const [generating, setGenerating] = useState(false);
  return (
    <div className='course-card'>
      <LessonContent
        lesson={lesson}
        lessonTitles={unitLessons}
        setGenerating={setGenerating}
      />
      <LessonControls
        lessonId={lesson._id}
        unitLessons={unitLessons}
        courseId={courseId}
        unitId={unitId}
        generating={generating}
      />
    </div>
  );
}
