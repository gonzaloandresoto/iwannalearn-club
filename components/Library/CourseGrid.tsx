'use client';

import useUserContext from '@/hooks/useUserContext';
import { useEffect, useState } from 'react';
import CourseCard from '../Library/CourseCard';

interface Course {
  _id: string;
  title: string;
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
    <div className='grid lg:grid-cols-2 grid-cols-1  gap-10'>
      {courses?.map((course) => (
        <CourseCard
          key={course._id}
          courseId={course._id}
          title={course.title}
        />
      ))}
    </div>
  );
}

export default CourseGrid;
