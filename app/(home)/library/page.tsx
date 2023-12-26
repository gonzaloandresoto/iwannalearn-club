import CourseGrid from '@/components/Library/CourseGrid';

async function Library() {
  return (
    <div className='flex flex-col grow items-center'>
      <div className='w-[800px] flex flex-col gap-8'>
        <p className='text-xl font-bold'>My Courses</p>
        <CourseGrid />
      </div>
    </div>
  );
}

export default Library;
