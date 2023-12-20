interface Content {
  title?: string;
  content?: string;
}

interface TextLessonContentProps {
  item: Content;
  handleNext: () => void;
  handlePrev: () => void;
  activePage?: number;
}

const TextLessonContent: React.FC<TextLessonContentProps> = ({
  item,
  handleNext,
  handlePrev,
  activePage,
}) => {
  return (
    <div className='w-full h-max flex flex-col items-center'>
      <div className='w-full flex flex-col gap-8'>
        <p className='text-2xl font-bold'>{item.title}</p>
        <p className='text-lg'>{item.content}</p>
      </div>

      <div className='fixed bottom-16 flex gap-2'>
        <button
          onClick={handlePrev}
          className='main-button disabled:opacity-50'
          disabled={activePage === 0}
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className='main-button '
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TextLessonContent;
