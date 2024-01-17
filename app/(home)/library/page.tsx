import CourseGrid from '@/components/Library/CourseGrid';

export default function Library() {
  return (
    <div className='flex grow flex-col items-center gap-8'>
      <p className='h1 font-sourceSerif'>library</p>
      <CourseGrid />
    </div>
  );
}
