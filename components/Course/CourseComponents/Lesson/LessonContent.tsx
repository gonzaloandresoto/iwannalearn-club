// import { useState } from 'react';
// import LessonActionsDesktop from './LessonActionsDesktop';
// import EmptyState from '@/components/Home/CustomGeneration/EmptyState';
import useTOCContext from '@/hooks/useTOCContext';
import { useCompletion } from 'ai/react';
import { set } from 'mongoose';

// import { generateLessonContent } from '@/lib/actions/generate.actions';
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

interface Content {
  title?: string;
  content?: string;
  _id: string;
}

interface LessonContentProps {
  item: Content;
  unitId: string;
  generatedNewContent?: boolean;
  setGeneratedNewContent?: (value: boolean) => void;
}

export default function LessonContent({
  item,
  unitId,
  generatedNewContent,
  setGeneratedNewContent,
}: LessonContentProps) {
  const activePage = useSearchParams()?.get('activePage');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState('');
  const { courseDetails } = useTOCContext();

  const unitTitle =
    courseDetails &&
    courseDetails?.tableOfContents &&
    JSON.parse(courseDetails.tableOfContents).find(
      (item: any) => item.unitId === unitId
    )?.title;

  const {
    completion,
    complete,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/generate-lesson-text',
    body: {
      lessonId: item._id,
      courseTitle: courseDetails && courseDetails.title,
      courseSummary: courseDetails && courseDetails.summary,
      unitTitle: unitTitle,
      unitLessons:
        courseDetails.tableOfContents &&
        JSON.parse(courseDetails?.tableOfContents),
      lessonTitle: item.title,
    },
  });

  useEffect(() => {
    setLessonContent(item.content || '');
  }, [item]);

  useEffect(() => {
    const getLessonContent = async () => {
      const completion = await complete('dont respond');
      if (completion) {
        setLessonContent(completion);
        setGeneratedNewContent?.(!generatedNewContent);
      }
    };

    if (lessonContent === 'generate') {
      getLessonContent();
    }
  }, [lessonContent]);

  useEffect(() => {
    const convertMarkdownToHtml = async (markdown: string) => {
      try {
        const result = await remark()
          .use(html, { sanitize: false })
          .process(markdown);
        setHtmlContent(result.toString());
      } catch (error) {
        console.error('Error converting Markdown to HTML:', error);
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
    <div className='lesson-quiz-content'>
      <div className='w-full flex flex-col gap-6'>
        <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
          {item?.title}
        </p>
        <div
          className='lesson-text flex flex-col gap-2'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

// if (loading) return <EmptyState />;

{
  /* <LessonActionsDesktop
  lesson={item}
  unitId={unitId}
  setLoading={setLoading}
/> */
}

// const generateLessonText = async () => {
//   const unitTitle = JSON.parse(courseDetails.tableOfContents).find(
//     (item: any) => item.unitId === unitId
//   )?.title;

//   const lessonContentText = await generateLessonContent({
//     courseTitle: courseDetails.title,
//     courseSummary: courseDetails.summary,
//     unitTitle: unitTitle,
//     unitLessons: JSON.parse(courseDetails?.tableOfContents),
//     lessonTitle: item.title,
//   });
//   setLessonContent(lessonContentText);
// };
// generateLessonText();
