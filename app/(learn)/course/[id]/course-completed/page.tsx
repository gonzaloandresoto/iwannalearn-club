import CourseCompletion from '@/components/Course/CourseComponents/CourseCompletion';
import { getCourseById } from '@/lib/actions/course.actions';

export default async function CourseCompleted({ params: { id } }: any) {
  const course = await getCourseById(id);
  return (
    <div className='course-page'>
      <CourseCompletion course={course} />
    </div>
  );
}
