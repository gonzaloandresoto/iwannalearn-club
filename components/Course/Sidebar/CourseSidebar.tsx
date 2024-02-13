import FurtherReading from '@/components/Course/Sidebar/FurtherReading';
import TutorChat from '@/components/Course/Sidebar/TutorChat';
import { Lesson } from '@/types';

interface CourseSidebarProps {
  lesson: Lesson | undefined;
}

export default function CourseSidebar({ lesson }: CourseSidebarProps) {
  return (
    <div className='w-[320px] h-full hidden lg:flex flex-col gap-4 pb-4'>
      <FurtherReading lesson={lesson} />
      <TutorChat />
    </div>
  );
}
