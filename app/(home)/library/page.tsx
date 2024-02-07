import CourseGrid from '@/components/Library/Grid/CourseGrid';

export default function Library() {
  return (
    <div className='flex grow flex-col items-center gap-8 bg-tertiary-tan'>
      <p className='h1 font-sourceSerif'>library</p>
      <CourseGrid />
    </div>
  );
}
