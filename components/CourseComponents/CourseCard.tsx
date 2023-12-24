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
    <div className='fixed bottom-0 w-[720px] h-5/6 flex flex-col items-center px-8 pt-8 bg-tertiary-grey rounded-t-xl overflow-y-auto'>
      <div className='w-full h-max flex flex-col gap-8'>
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
