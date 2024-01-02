import { getCourseById } from '@/lib/actions/course.actions';
import CourseCover from '@/components/Course/CourseComponents/CourseCover';

export default async function CourseContent({
  params: { id },
}: {
  params: { id: string };
}) {
  const course = await getCourseById(id);
  return (
    <div className='flex flex-col grow items-center bg-tertiary-tan'>
      <CourseCover
        courseId={course._id}
        title={course.title}
        summary={course.summary}
        tableOfContents={course?.tableOfContents}
      />
    </div>
  );
}
