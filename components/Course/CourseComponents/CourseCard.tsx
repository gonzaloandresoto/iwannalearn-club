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
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const currentItem = unitContent[activePage];
  const correctAnswer = Number(currentItem.answer);
  return (
    <div className='course-card'>
      <div className='course-card-inner h-max'>
        {currentItem?.type === 'lesson' && (
          <LessonContent
            item={currentItem}
            unitId={unitId}
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
          setActivePage={setActivePage}
          unitLength={unitContent.length}
          courseId={courseId}
          unitId={unitId}
        />
      )}
      {currentItem?.type === 'quiz' && (
        <QuizNavigationControls
          activePage={activePage}
          setActivePage={setActivePage}
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
