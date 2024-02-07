import CourseGrid from '@/components/Home/CourseGrid';
import GenerateCourse from '@/components/Home/GenerateCourse';
import { SignedOut } from '@clerk/nextjs';

export default function Generate() {
  return (
    <div className='main-page justify-center'>
      <div className='flex flex-col gap-8 items-center'>
        <GenerateCourse />

        <SignedOut>
          <CourseGrid />
        </SignedOut>
      </div>
    </div>
  );
}
