'use client';

import { useEffect, useState } from 'react';

import { useCompletion } from 'ai/react';
import useUserContext from '@/hooks/useUserContext';
import useTOCContext from '@/hooks/useTOCContext';

import { saveGeneratedLessonText } from '@/lib/actions/element.action';

import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

import { Lesson, UnitLessons } from '@/types';

interface LessonContentProps {
  lesson: Lesson | undefined;
  lessonTitles: UnitLessons[] | undefined;
  setGenerating: (value: boolean) => void;
}

export default function LessonContent({
  lesson,
  lessonTitles,
  setGenerating,
}: LessonContentProps) {
  const { user } = useUserContext();
  const { courseDetails } = useTOCContext();
  const [lessonContent, setLessonContent] = useState<string>(
    lesson?.content || ''
  );
  const [htmlContent, setHtmlContent] = useState<string>('');

  const { completion, complete } = useCompletion({
    api: '/api/generate-lesson-text',
    body: {
      lessonTitle: lesson?.title,
      courseTitle: courseDetails.title,
      courseSummary: courseDetails.summary,
      lessonTitles: JSON.stringify(lessonTitles),
    },
  });

  useEffect(() => {
    const getLessonContent = async () => {
      setGenerating(true);
      const completion = await complete('dont respond');
      if (completion) {
        await saveGeneratedLessonText(lesson?._id || '', completion);
        setLessonContent(completion);

        setGenerating(false);
      }
    };

    if (lessonContent === 'generate' && user && user._id) {
      getLessonContent();
    }
  }, [lessonContent]);

  useEffect(() => {
    const convertMarkdownToHtml = async (markdown: string) => {
      try {
        const result = await remark()
          .use(html, { sanitize: false })
          .use(gfm)
          .process(markdown);
        setHtmlContent(result.toString());
      } catch (error) {
        setHtmlContent('Error displaying content');
      }
    };

    if (lessonContent === 'generate') {
      convertMarkdownToHtml(completion);
    } else {
      convertMarkdownToHtml(lessonContent);
    }
  }, [lessonContent, completion]);

  return (
    <div className='course-card-inner h-max'>
      <div className='lesson-quiz-content'>
        <div className='w-full flex flex-col gap-6'>
          <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
            {lesson?.title}
          </p>
          <div
            className='lesson-text flex flex-col gap-2'
            dangerouslySetInnerHTML={{
              __html: htmlContent || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
