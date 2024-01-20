import CourseCompletion from '@/components/Course/CourseComponents/CourseCompletion';
import { getCourseById } from '@/lib/actions/course.actions';

import console from 'console';

export default async function CourseCompleted({ params }: any) {
  console.log(params);

  const course = await getCourseById(params?.id);
  return (
    <div className='course-page'>
      <CourseCompletion course={course} />
    </div>
  );
}
