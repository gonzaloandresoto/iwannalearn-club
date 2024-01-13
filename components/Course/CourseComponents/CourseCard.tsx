import QuizContent from './Quiz/QuizContent';
import LessonContent from './Lesson/LessonContent';

interface UnitContentItems {
  _id: string;
  content?: string;
  createdAt: any;
  order: number;
  title?: string;
  type: string;
  updatedAt: any;
  answer?: string;
  choices?: any;
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
    <div className='course-card'>
      <div className='w-full h-full overflow-y-auto'>
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
  );
};

export default CourseCard;
