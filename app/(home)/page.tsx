import CourseGrid from '@/components/Home/CourseGrid';
import GenerateCourse from '@/components/Home/GenerateCourse';
import { getRecentCourses } from '@/lib/actions/course.actions';
import { Course } from '@/types';
import { SignedOut } from '@clerk/nextjs';

export default async function Generate() {
  const courses = await getRecentCourses(0, 6);
  return (
    <section className='main-page justify-center'>
      <div className='flex flex-col gap-8 items-center'>
        <GenerateCourse />

        <SignedOut>
          <CourseGrid courses={courses ? [courses] : []} />
        </SignedOut>
      </div>
    </section>
  );
}
