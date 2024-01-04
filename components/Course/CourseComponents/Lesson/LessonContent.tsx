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
    <div className='w-full h-full flex flex-col justify-between'>
      <div className='w-full flex flex-col grow gap-4 overflow-y-auto lg:pt-16 pt-12 pb-8 lg:px-12 px-4'>
        <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
          {item?.title}
        </p>
        <p className='md:text-xl text-lg text-tertiary-black font-medium font-rosario'>
          {item?.content}
        </p>
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
