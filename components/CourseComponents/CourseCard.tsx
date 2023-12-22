'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import QuizContent from './QuizContent';
import TextLessonContent from './TextLessonContent';

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
  const router = useRouter();
  const handleNext = () => {
    if (activePage === unitContent.length - 1 && courseId && unitId) {
      router.push(`/course/${courseId}/${unitId}/completed`);
    }
    setActivePage(activePage + 1);
  };
  const handlePrev = () => {
    if (activePage === 0) return null;
    setActivePage(activePage - 1);
  };
  return (
    <div className='fixed bottom-0 w-[720px] h-5/6 flex flex-col items-center px-8 pt-8 bg-tertiary-grey rounded-t-xl overflow-y-auto'>
      <div className='w-full h-max flex flex-col gap-8'>
        <div>
          {Object.values(unitContent).map((item, index) => {
            return (
              <div key={index}>
                {activePage === index && (
                  <>
                    {item.type === 'lesson' && (
                      <TextLessonContent
                        item={item}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        activePage={activePage}
                      />
                    )}
                    {item.type === 'quiz' && (
                      <QuizContent
                        item={item}
                        handleNext={handleNext}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
