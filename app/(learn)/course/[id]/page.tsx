import { getCourseById } from '@/lib/actions/generate.actions';
import CourseCover from '@/components/Course/CourseComponents/CourseCover';

export default async function CourseContent({
  params: { id },
}: {
  params: { id: string };
}) {
  const course = await getCourseById(id);
  return (
    <div className='flex flex-col grow items-center justify-end bg-tertiary-tan'>
      <CourseCover
        courseId={course?._id.toString()}
        title={course?.title}
        summary={course?.summary}
        tableOfContents={course?.tableOfContents}
      />
    </div>
  );
}
