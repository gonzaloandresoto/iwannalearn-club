'use client';

import { useEffect, useRef, useState } from 'react';
import useUserContext from '@/hooks/useUserContext';

import { getCoursesByUserId } from '@/lib/actions/course.actions';

import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

import CourseCard from '../../Shared/CourseCard/CourseCard';
import CourseGridPaginationControls from './CourseGridPaginationControls';

interface Course {
  _id: string;
  title: string;
  progress: number;
  createdAt: string;
}

export default function CourseGrid() {
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState<number>(0);
  const isNext = useRef<boolean>(false);
  const { user } = useUserContext();

  const getCourses = async () => {
    if (!user) return;
    setLoading(true);
    const fetchedCourses = await getCoursesByUserId({
      userId: user?._id,
      page: page,
      limit: 6,
    });

    if (fetchedCourses.courses) {
      setCourses(fetchedCourses.courses);
      isNext.current = fetchedCourses.isNext;
    }
    setLoading(false);
  };

  useEffect(() => {
    getCourses();
  }, [user, page]);

  const handlePageChange = (direction: string) => {
    if (direction === 'prev' && page !== 0) {
      setPage((prev) => prev - 1);
    } else if (direction === 'next' && isNext.current) {
      setPage((prev) => prev + 1);
    } else {
      return;
    }
  };

  if (loading) return <LoadingState />;

  if (courses?.length === 0)
    return (
      <EmptyState
        text='You have no courses yet.'
        image='/course-icons/grad-cap.svg'
      />
    );

  return (
    <div className='bg-tertiary-tan'>
      <div className='max-w-[1024px] h-max grid lg:grid-cols-2 grid-cols-1 gap-10 px-4 pb-12'>
        {courses?.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            title={course.title}
            date={course.createdAt}
            progress={course.progress}
            isPublic={false}
          />
        ))}
      </div>
      {((courses.length >= 6 && isNext) || page !== 0) && (
        <CourseGridPaginationControls
          page={page}
          handlePageChange={handlePageChange}
          isNext={isNext}
          loading={loading}
        />
      )}
    </div>
  );
}
