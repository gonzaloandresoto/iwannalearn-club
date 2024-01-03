import QuizContent from './Quiz/QuizContent';
import LessonContent from './Lesson/LessonContent';

interface UnitContentItems {
  title: string;
  status?: string;
  type: string;
  content?: string;
  question?: string;
  answer?: string;
  _id: string;
  unitId: string;
}

interface CourseCardProps {
  unitContent: UnitContentItems[];
  activePage: number;
  setActivePage: (page: number) => void;
  unitId: string;
  courseId: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  unitId,
  courseId,
  unitContent,
  activePage,
  setActivePage,
}) => {
  const currentItem = unitContent[activePage];
  return (
    <div className='lg:w-[800px] w-full lg:h-5/6 h-full flex flex-col gap-6 items-center lg:px-12 px-4 lg:pt-16 pt-12 bg-white lg:border-2 border-t-2 border-primary-tan lg:rounded-t-2xl overflow-y-auto'>
      <div className='w-full'>
        <div>
          {currentItem?.type === 'lesson' && (
            <LessonContent
              item={currentItem}
              activePage={activePage}
              setActivePage={setActivePage}
              unitLength={unitContent.length}
              courseId={courseId}
              unitId={unitId}
            />
          )}
          {currentItem?.type === 'quiz' && (
            <QuizContent
              item={currentItem}
              activePage={activePage}
              setActivePage={setActivePage}
              unitLength={unitContent.length}
              courseId={courseId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
