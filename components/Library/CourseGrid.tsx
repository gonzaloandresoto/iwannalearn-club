'use client';

import { useEffect, useRef, useState } from 'react';
import useUserContext from '@/hooks/useUserContext';

import { getCoursesByUserId } from '@/lib/actions/course.actions';

import CourseCard from '../Library/CourseCard';
import EmptyState from '../EmptyState';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  progress: number;
}

export default function CourseGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState<number>(0);
  const isNext = useRef<boolean>(false);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;

    const getCourses = async () => {
      const courses = await getCoursesByUserId({
        userId: user?._id,
        page: page,
        limit: 6,
      });

      if (courses.courses) {
        setCourses(courses.courses);
        isNext.current = courses.isNext;
      }
    };

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
            progress={course.progress}
          />
        ))}
      </div>
      {((courses.length >= 6 && isNext) || page !== 0) && (
        <div className='w-full flex flex-row gap-3 items-center justify-center pb-12'>
          <button
            disabled={page === 0}
            onClick={() => handlePageChange('prev')}
            className='flex items-center justify-center gap-2 py-1 px-3 hover:bg-tertiary-black bg-secondary-black text-tertiary-tan font-medium rounded-md disabled:bg-tertiary-black'
          >
            <ArrowLeft />
            <p>Prev</p>
          </button>
          <div className='bg-white border-2 border-primary-tan py-1 px-3 rounded-md text-secondary-black'>
            <p>{page + 1}</p>
          </div>

          <button
            disabled={!isNext.current}
            onClick={() => handlePageChange('next')}
            className='flex items-center justify-center gap-2 py-1 px-3 hover:bg-tertiary-black bg-secondary-black text-tertiary-tan font-medium rounded-md disabled:bg-tertiary-black'
          >
            <p>Next</p>
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
