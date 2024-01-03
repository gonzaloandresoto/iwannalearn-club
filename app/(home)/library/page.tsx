import CourseGrid from '@/components/Library/CourseGrid';

async function Library() {
  return (
    <div className='main-page'>
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
