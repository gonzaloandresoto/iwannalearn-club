import { getRecentCourses } from '@/lib/actions/course.actions';
import CourseCard from '../Library/CourseCard';
import { useEffect, useState } from 'react';

interface Course {
  _id: string;
  title: string;
  progress: number;
  createdAt: string;
}

const CourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const recent = await getRecentCourses({
        page: 0,
        limit: 6,
      });

      setCourses(recent);
    };

    fetchCourses();
  }, []);

  return (
    <div className='flex flex-col gap-4 items-center bg-tertiary-tan px-4 pb-12'>
      <div className='max-w-[1024px] h-max grid lg:grid-cols-2 grid-cols-1 gap-10 '>
        {courses?.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            title={course.title}
            progress={course.progress}
            createdAt={course.createdAt}
            noAuth={false}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
