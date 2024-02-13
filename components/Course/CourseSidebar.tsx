import FurtherReading from '@/components/Course/FurtherReading';
import TutorChat from '@/components/Course/TutorChat';

export default function CourseSidebar() {
  return (
    <div className='w-[320px] h-full hidden lg:flex flex-col gap-4 pb-4'>
      <FurtherReading />
      <TutorChat />
    </div>
  );
}
