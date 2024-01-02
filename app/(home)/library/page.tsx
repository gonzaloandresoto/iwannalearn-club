import CourseGrid from '@/components/Library/CourseGrid';

async function Library() {
  return (
    <div className='flex flex-col grow items-center px-4 py-6 overflow-y-auto'>
      <div className='flex flex-col gap-8'>
        <p className='md:text-4xl text-2xl font-bold font-sourceSerif text-secondary-black md:text-center'>
          library
        </p>
        <CourseGrid />
      </div>
    </div>
  );
}

export default Library;
