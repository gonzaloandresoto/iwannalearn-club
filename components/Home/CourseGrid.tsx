import { getRecentCourses } from '@/lib/actions/course.actions';
import CourseCard from './CourseCard';

interface Course {
  _id: string;
  title: string;
  progress: number;
  createdAt: string;
}

const CourseGrid = async () => {
  const courses = await getRecentCourses({
    page: 0,
    limit: 6,
  });

  return (
    <div className='flex flex-col gap-4 items-center bg-tertiary-tan px-4 pb-12'>
      <div className='max-w-[1024px] h-max grid lg:grid-cols-2 grid-cols-1 gap-10 '>
        {courses?.map((course: any) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            title={course.title}
            date={course.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
