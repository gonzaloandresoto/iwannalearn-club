import useUserContext from '@/hooks/useUserContext';
import CourseCard from '../Library/CourseCard';
import { getCourseByUserId } from '@/lib/actions/generate.actions';

interface Course {
  _id: string;
  title: string;
}

export default async function CourseGrid() {
  const { user } = useUserContext();
  const courses = await getCourseByUserId(user?._id || '');

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
