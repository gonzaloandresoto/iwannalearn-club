import CourseGrid from '@/components/Home/CourseGrid';
import GenerateCourse from '@/components/Home/GenerateCourse';
import { getRecentCourses } from '@/lib/actions/course.actions';
import { SignedOut } from '@clerk/nextjs';

export default async function Generate() {
  const courses = await getRecentCourses({
    page: 0,
    limit: 6,
  });
  return (
    <div className='main-page justify-center'>
      <div className='flex flex-col gap-8 items-center'>
        <GenerateCourse />

        <SignedOut>
          <CourseGrid courses={courses} />
        </SignedOut>
      </div>
    </div>
  );
}
