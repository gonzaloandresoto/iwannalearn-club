import CourseCover from '@/components/Course/CourseComponents/CourseCover';

import EmptyState from '@/components/Course/EmptyState';
import { getCourseById } from '@/lib/actions/course.actions';

export default async function CourseContent({
  params: { id },
}: {
  params: { id: string };
}) {
  const course = await getCourseById(id, true);
  return (
    <section className='flex grow flex-col items-center bg-tertiary-tan'>
      {course ? (
        <CourseCover
          courseId={course?._id}
          title={course?.title}
          summary={course?.summary}
          tableOfContents={course?.tableOfContents}
        />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
