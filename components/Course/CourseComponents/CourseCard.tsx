'use client';

import QuizContent from './Quiz/QuizContent';
import LessonContent from './Lesson/LessonContent';
import LessonNavigationControls from './Lesson/LessonNavigationControls';
import QuizNavigationControls from './Quiz/QuizNavigationControls';
import { useState } from 'react';

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
  unitId: string;
  courseId: string;
  generatedNewContent?: boolean;
  setGeneratedNewContent?: (value: boolean) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  unitId,
  courseId,
  unitContent,
  activePage,
  setGeneratedNewContent,
  generatedNewContent,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const currentItem = unitContent[activePage];
  const correctAnswer = Number(currentItem?.answer);

  return (
    <div className='course-card'>
      <div className='course-card-inner h-max'>
        {currentItem?.type === 'lesson' && (
          <LessonContent
            item={currentItem}
            unitId={unitId}
            generatedNewContent={generatedNewContent}
            setGeneratedNewContent={setGeneratedNewContent}
          />
        )}
        {currentItem?.type === 'quiz' && (
          <QuizContent
            item={currentItem}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
          />
        )}
      </div>
      {currentItem?.type === 'lesson' && (
        <LessonNavigationControls
          activePage={activePage}
          unitLength={unitContent.length}
          courseId={courseId}
          unitId={unitId}
        />
      )}
      {currentItem?.type === 'quiz' && (
        <QuizNavigationControls
          activePage={activePage}
          unitLength={unitContent.length}
          courseId={courseId}
          unitId={currentItem.unitId}
          quizId={currentItem._id}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          correctAnswer={correctAnswer}
        />
      )}
    </div>
  );
};

export default CourseCard;
