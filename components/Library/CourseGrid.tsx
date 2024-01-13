'use client';

import { useEffect, useState } from 'react';
import useUserContext from '@/hooks/useUserContext';

import { getCourseByUserId } from '@/lib/actions/generate.actions';

import CourseCard from '../Library/CourseCard';
import EmptyState from '../EmptyState';

interface Course {
  _id: string;
  title: string;
}

export default function CourseGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;
    const getCourses = async () => {
      const courses = await getCourseByUserId(user?._id || '');
      setCourses(courses);
    };

    getCourses();
  }, [user]);

  if (courses?.length === 0)
    return (
      <EmptyState
        text='You have no courses yet.'
        image='/course-icons/grad-cap.svg'
      />
    );

  return (
    <div className='w-full h-max flex flex-col items-center gap-10'>
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
