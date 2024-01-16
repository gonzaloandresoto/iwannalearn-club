import CourseGrid from '@/components/Library/CourseGrid';

export default function Library() {
  return (
    <div className='main-page gap-8 overflow-y-scroll'>
      <p className='h1 font-sourceSerif'>library</p>
      <CourseGrid />
    </div>
  );
}
