import LessonNavigationControls from './LessonNavigationControls';

interface Content {
  title?: string;
  content?: string;
}

interface TextLessonContentProps {
  item: Content;
  activePage: number;
  setActivePage: (page: number) => void;
  unitLength: number;
  courseId: string;
  unitId: string;
}

const LessonContent: React.FC<TextLessonContentProps> = ({
  item,
  activePage,
  setActivePage,
  unitLength,
  courseId,
  unitId,
}) => {
  return (
    <div className='w-full h-max flex flex-col items-center'>
      <div className='w-full flex flex-col gap-8'>
        <p className='text-2xl font-bold'>{item.title}</p>
        <p className='text-lg'>{item.content}</p>
      </div>
      <LessonNavigationControls
        activePage={activePage}
        setActivePage={setActivePage}
        unitLength={unitLength}
        courseId={courseId}
        unitId={unitId}
      />
    </div>
  );
};

export default LessonContent;
