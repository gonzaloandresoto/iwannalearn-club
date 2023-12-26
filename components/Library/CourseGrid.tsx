'use client';

import useUserContext from '@/hooks/useUserContext';
import { useEffect, useState } from 'react';
import CourseCard from '../Library/CourseCard';

interface Course {
  _id: string;
  title: string;
  summary: string;
}

function CourseGrid() {
  const { user } = useUserContext();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/user-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user._id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      });
  }, [user]);

  return (
    <div className='flex flex-col gap-4'>
      {courses.map((course) => (
        <CourseCard
          courseId={course._id}
          title={course.title}
          summary={course.summary}
        />
      ))}
    </div>
  );
}

export default CourseGrid;
