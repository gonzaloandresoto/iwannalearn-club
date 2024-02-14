import { Course } from '@/types';
import CourseCard from '../Shared/CourseCard/CourseCard';

interface CourseGridProps {
  courses: Course[] | undefined;
}

const CourseGrid = async ({ courses }: CourseGridProps) => {
  return (
    <div className='flex flex-col gap-4 items-center bg-tertiary-tan px-4 pb-12'>
      <div className='max-w-[1024px] h-max grid lg:grid-cols-2 grid-cols-1 gap-10 '>
        {courses?.map((course: Course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            title={course.title}
            date={course.createdAt}
            isPublic={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
